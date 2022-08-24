package com.jasonqiu.springbootreactdemo.security.service;

public interface UserInfoService {
    String getEmailByUsername(String username);

    Long findIdByUsername(String username);

    Long findIdByEmail(String email);

    void changeRoleByUsername(String username, Integer role);

    void changeRoleByEmail(String email, Integer role);
}
