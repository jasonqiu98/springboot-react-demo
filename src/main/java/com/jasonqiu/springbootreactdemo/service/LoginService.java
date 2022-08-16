package com.jasonqiu.springbootreactdemo.service;

import java.util.Map;

import com.jasonqiu.springbootreactdemo.entity.ResponseResult;
import com.jasonqiu.springbootreactdemo.entity.UserInfo;

public interface LoginService {
    ResponseResult<Map<String, String>> login(UserInfo userInfo);
}
