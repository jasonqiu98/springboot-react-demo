package com.jasonqiu.springbootreactdemo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jasonqiu.springbootreactdemo.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.entity.UserLoginDetails;
import com.jasonqiu.springbootreactdemo.repository.UserInfoRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    final UserInfoRepository userInfoRepository;

    public UserDetailsServiceImpl(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // query the user info by username
        UserInfo userInfo = userInfoRepository.findByUsername(username);

        // if the result is null, then throw an exception
        if (null == userInfo) {
            throw new UsernameNotFoundException("The username or password is wrong.");
        }

        // TODO: authenticate the user by user type

        // return a new object of UserLoginDetails
        return new UserLoginDetails(userInfo);
    }
}
