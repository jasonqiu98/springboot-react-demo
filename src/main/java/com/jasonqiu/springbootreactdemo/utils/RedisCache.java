package com.jasonqiu.springbootreactdemo.utils;

import java.util.*;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

@SuppressWarnings(value = { "rawtypes", "unchecked" })
@Service
public class RedisCache {

    final RedisTemplate redisTemplate;

    public RedisCache(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * set expiry time
     * 
     * @param key     Redis key
     * @param timeout timeout
     * @return true=set succeeds; false=set fails
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * set expiry time
     * 
     * @param key     Redis key
     * @param timeout timeout
     * @param unit    time unit
     * @return true=set succeeds; false=set fails
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * cache basic data types, Integer, String and entity classes etc.
     * with key and value
     */
    public <T> void set(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * cache basic data types, Integer, String and entity classes etc.
     * with key, value, timeout and time unit
     */
    public <T> void set(final String key, final T value, final Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * get cache object
     * 
     * @param key Redis key
     * @return Redis value
     */
    public <T> T get(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * delete an object by key
     * 
     * @param key
     * @return delete succeeds or not
     */
    public boolean delete(final String key) {
        return redisTemplate.delete(key);
    }

    /**
     * delete a collection of objects
     * 
     * @param collection multiple objects
     * @return
     */
    public long deleteCollection(final Collection collection) {
        return redisTemplate.delete(collection);
    }

    /**
     * Below here are getters and setters for objects in
     * - List (setList, getList)
     * - Set (setSet, getSet)
     * - Map (setMap, getMap)
     * - Map value(s) (putMapVal, getMapVal, deleteMapVal, getMapVals)
     */

    public <T> long setList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }


    public <T> List<T> getList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public <T> BoundSetOperations<String, T> setSet(final String key, final Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext()) {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    public <T> Set<T> getSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    public <T> void setMap(final String key, final Map<String, T> dataMap) {
        if (null != dataMap) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    public <T> Map<String, T> getMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    public <T> void putMapVal(final String key, final String hashKey, final T value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public <T> T getMapVal(final String key, final String hashKey) {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hashKey);
    }

    public void deleteMapVal(final String key, final String hashKey) {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.delete(key, hashKey);
    }

    public <T> List<T> getMapVals(final String key, final Collection<Object> hashKeys) {
        return redisTemplate.opsForHash().multiGet(key, hashKeys);
    }

    /**
     * Find all keys matching the given pattern
     * @param pattern regex
     */
    public Collection<String> getKeys(final String pattern) {
        return redisTemplate.keys(pattern);
    }

}
