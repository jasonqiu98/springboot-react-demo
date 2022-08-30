package com.jasonqiu.springbootreactdemo.security.service;

import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;

public interface RegistrationService {

    boolean sendToken(String email);

    UserInfo register(RegistrationModel registrationModel);

    // String sendToken(String email, Long userId);

    // String resendToken(String token);

    /**
     * return:
     * false - invalid or expired
     * true - valid
     */
    // boolean validateToken(String token);

    // UserInfo findUserByEmail(String email);

    // byte resetPassword(String token, String newPassword);

    // byte changePassword(String email, String oldPassword, String newPassword);

}
