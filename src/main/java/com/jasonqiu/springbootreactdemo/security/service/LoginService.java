package com.jasonqiu.springbootreactdemo.security.service;

import org.springframework.http.ResponseEntity;

import com.jasonqiu.springbootreactdemo.security.entity.UserDetailsPackage;

public interface LoginService {

    ResponseEntity<UserDetailsPackage> login(String username, String password);

    boolean logout();
    
}
