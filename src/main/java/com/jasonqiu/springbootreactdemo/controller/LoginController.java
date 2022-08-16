package com.jasonqiu.springbootreactdemo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jasonqiu.springbootreactdemo.entity.ResponseResult;
import com.jasonqiu.springbootreactdemo.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.service.LoginService;

@RestController
public class LoginController {

    final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseResult<Map<String, String>> login(@RequestBody UserInfo userInfo) {
        return loginService.login(userInfo);
    }
    
}
