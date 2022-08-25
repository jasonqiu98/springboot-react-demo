package com.jasonqiu.springbootreactdemo.security.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jasonqiu.springbootreactdemo.security.repository.UserInfoRepository;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Service
public class UserInfoServiceImpl implements UserInfoService {
    private final UserInfoRepository userInfoRepository;

    @Override
    public String getEmailByUsername(String username) {
        return userInfoRepository.findEmailByUsername(username);
    }

    @Override
    public Long findIdByUsername(String username) {
        return userInfoRepository.findIdByUsername(username);
    }

    @Override
    public Long findIdByEmail(String email) {
        return userInfoRepository.findIdByEmail(email);
    }

    @Override
    public void changeRoleByUsername(String username, Integer role) {
        userInfoRepository.changeRoleByUsername(username, role);
    }

    @Override
    public void changeRoleByEmail(String email, Integer role) {
        userInfoRepository.changeRoleByEmail(email, role);
    }
}
