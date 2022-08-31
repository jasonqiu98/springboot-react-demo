# SpringBoot + React Demo

Inspired from [the original repo](https://github.com/eugenp/tutorials/tree/master/spring-boot-modules/spring-boot-react/src/main/java/com/baeldung/springbootreact) with SpringBoot + MyBatis + ReactJS. A detailed tutorial of the original repository can be found at [the link here](https://www.baeldung.com/spring-boot-react-crud).

## What's new?

This Java 11 project provides the following functionalities.

- The backend was implemented with the latest version of **Spring Boot, v2.7.2**. The deprecated APIs in previous versions were not used in this project.
    - Basic CRUD operations were implemented with the help of *PostgreSQL* and *MyBatis*. The system manages the information of clients in a Client List.
- Login, Log out and Register were implemented with **Spring Security** (under the folder `src/main/java/com/jasonqiu/springbootreactdemo`). 
    - Login was implemented with *JWT + Redis*. 
        - Redis helps store the key-value pair of (`JWT` : `UserDetails`) every time the login is successful.
        - When the user logs out, this key-value pair will be deleted from Redis. The login is valid for one hour.
    - Sending verification code was mocked by outputting to the console.
        - Check the console log of `springboot-app` to get the token if you need :) The verification code is valid for five minutes.
    - Three authorities were defined in the system, `admin`, `user` and `guest`.
        - The three authorities have different sets of permissions to the system.
- The frontend was purely implemented in **React 18**.
    - All the (UI) components were borrowed from *Material UI*. No additional CSS files were involved.
        - So you'll see a system similar to the simplest MUI websites.
    - *React Router v6* (the latest version) was used in this project.
    - The (latest) recommended usage of *Redux* was adopted in this project.
    - Some certain buttons (e.g. Delete) were debounced using a self-defined hook `useDebounce` (borrowed somewhere from the Internet)
- The project was deployed with *Dockerfile* and *docker-compose.yml*. It includes five containers.
    - `demo-frontend` deploys the frontend build (container_name: react-app)
    - `demo-backend` deploys the backend .jar package (container_name: springboot-app)
    - `db` deploys the PostgreSQL 14.4 image and inits with the database `demo_db` (container_name: postgres2)
    - `redis-master` deploys a Redis master node from Redis 7.0 (container_name: myredis)
    - `redis-replica` deploys a Redis replica (container_name: myredis-replica)

## Run this project

Make sure the Docker daemon is running on your machine, and simply run the script `run.sh` with the following command line.

```shell
sh run.sh
```

If there is no error, search `http://localhost:3000` in your browser, and you can access our Client List.

If there is any error, consider the following issues.
- Dependency issues. Check if the Docker daemon process is running.
- It might be the case your local machine already has some containers with the same names. In this case, consider comment the specific lines of `container_name` in the file *docker-compose.yml* where the name has already been taken by your local machine.

## Login Usernames and Passwords

I have provided two default username and password combinations.

- An `admin` account
    - username: `admin`, password: `helloworld`
- A `user` account
    - username: `jasonqiu`, password: `helloworld`
- You can register your own account, and then the account becomes a `guest` account.

Enjoy!
