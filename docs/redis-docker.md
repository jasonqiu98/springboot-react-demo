# Set up a Redis Docker image

From https://segmentfault.com/a/1190000039769819

1. Start the docker daemon process
2. Set up a configuration file in the path `~/redis-config`
    ```shell
    mkdir ~/redis-config
    wget -P ~/redis-config http://download.redis.io/redis-stable/redis.conf
    ```
3. Modify the configuration options in `~/redis-config/redis.conf`
    ```conf
    # bind 127.0.0.1 -::1   # (line 87) comment out this line as we want our instance to listen to all the interfaces
    protected-mode no       # (line 111) disable the protected mode
    daemonize yes           # (line 309) let Redis run as a daemon
    logfile "history.log"   # (line 354) log to "history.log" instead of stdout
    requirepass foobared    # (line 1036) uncomment this line to set up the password
    appendonly yes          # (line 1379) use the Append Only File (AOF) persistence mode
    ```
4. Create a container called `myredis` based on Redis 7.0
    ```shell
    docker run \
        -p 6379:6379 --name myredis \
        -v ~/redis-config/redis.conf:/etc/redis/redis.conf \
        -v ~/redis-config/data:/data:rw \
        --privileged=true -d redis:7.0 redis-server /etc/redis/redis.conf \
        --appendonly yes
    ```
5. Check whether `myredis` has been started
    ```shell
    docker ps                # check active containers
    docker logs myredis      # check error logs if myredis is not started
    docker inspect myredis   # inspect myredis
    docker port myredis      # check the port of redis
    ```
6. Set up a replica called `redis-worker`
    ```shell
    mkdir ~/redis-config/redis-worker
    cp ~/redis-config/redis.conf ~/redis-config/redis-worker/
    # modify ~/redis-config/redis-worker/redis.conf in between
    # port 6380                    # (line 138)
    # replicaof 172.17.0.2 6379    # (line 527) the ip should be the "IPAddress" value from `docker inspect myredis`
    # masterauth foobared          # (line 534) let worker containers know the password of the master
    docker run \
        -p 6380:6380 --name redis-worker \
        -v ~/redis-config/redis-worker/redis.conf:/etc/redis/redis.conf \
        -v ~/redis-config/redis-worker/data:/data:rw \
        --privileged=true -d redis:7.0 redis-server /etc/redis/redis.conf \
        --appendonly yes
    ```
7. Use `redis-cli` to check the configuration
    1. Enter the docker shell using `docker exec -it myredis bash`
    2. Within the docker shell, enter the Redis command line interface using `redis-cli`
    3. Within the Redis CLI, run the following commands
        ```shell
        auth foobared    # authenticate with the password
        info             # check whether redis-worker is already connected
        ```
    4. In the `#Replication` section, we should see the following output
        ```
        # Replication
        role:master
        connected_slaves:1
        slave0:ip=172.17.0.3,port=6379,state=online,offset=196,lag=1
        master_failover_state:no-failover
        master_replid:3ceadd1fa11d8358e3ad361e07e0089be0b25db2
        master_replid2:0000000000000000000000000000000000000000
        master_repl_offset:196
        second_repl_offset:-1
        repl_backlog_active:1
        repl_backlog_size:1048576
        repl_backlog_first_byte_offset:1
        repl_backlog_histlen:196
        ```
        And we can see that the `slave0` (i.e., our `redis-worker`) has been connected.
