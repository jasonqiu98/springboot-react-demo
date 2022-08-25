package com.jasonqiu.springbootreactdemo.security.entity;

import java.util.Map;

public class Role {

    /**
     * Here Java 11 is used
     * https://stackoverflow.com/questions/6802483/how-to-directly-initialize-a-hashmap-in-a-literal-way
     */
    public static final Map<Integer, String> roleMap = Map.ofEntries(
        Map.entry(0, "admin"),
        Map.entry(1, "user"),
        Map.entry(2, "client")
    );

}
