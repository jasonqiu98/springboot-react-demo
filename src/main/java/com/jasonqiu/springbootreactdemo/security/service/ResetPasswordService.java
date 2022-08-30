package com.jasonqiu.springbootreactdemo.security.service;

import javax.validation.Valid;

import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;

public interface ResetPasswordService {

    boolean sendToken(String email);
    
    void savePassword(@Valid RegistrationModel resetModel);
    
}
