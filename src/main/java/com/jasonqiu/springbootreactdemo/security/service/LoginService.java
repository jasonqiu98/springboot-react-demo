package com.jasonqiu.springbootreactdemo.security.service;

import org.springframework.http.ResponseEntity;

public interface LoginService {

    ResponseEntity<String> login(String username, String password);

    boolean logout();
    
}
