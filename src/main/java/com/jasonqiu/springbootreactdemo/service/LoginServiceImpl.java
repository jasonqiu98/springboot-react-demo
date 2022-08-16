package com.jasonqiu.springbootreactdemo.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.jasonqiu.springbootreactdemo.entity.ResponseResult;
import com.jasonqiu.springbootreactdemo.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.entity.UserLoginDetails;
import com.jasonqiu.springbootreactdemo.utils.JwtUtils;
import com.jasonqiu.springbootreactdemo.utils.RedisCache;

@Service
public class LoginServiceImpl implements LoginService {

    final AuthenticationManager authenticationManager;

    final JwtUtils jwtUtils;

    final RedisCache redisCache;

    public LoginServiceImpl(AuthenticationManager authenticationManager,
                            JwtUtils jwtUtils,
                            RedisCache redisCache) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.redisCache = redisCache;
    }

    @Override
    public ResponseResult<Map<String, String>> login(UserInfo userInfo) {

        // AuthenticationManager authenticates the user

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userInfo.getUsername(), userInfo.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // If not authenticated, throw an exception (implemented in UserDetailsServiceImpl.java)
        // If authenticated, generate jwt with user id

        UserLoginDetails userLoginDetails = (UserLoginDetails) authentication.getPrincipal();
        String userId = userLoginDetails.getUserInfo().getId().toString();
        String jwt = jwtUtils.createToken(userId);

        // Store user info into Redis
        // userId : userLoginDetails

        Map<String, String> map = new HashMap<>();
        map.put("token", jwt);

        redisCache.set("login:" + userId, userLoginDetails);

        // return a ResponseResult with jwt stored in it
        return new ResponseResult<Map<String, String>>(200, "login success", map);
    }

}
