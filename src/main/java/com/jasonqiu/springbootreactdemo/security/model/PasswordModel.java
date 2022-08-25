package com.jasonqiu.springbootreactdemo.security.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class PasswordModel {

    @Email
    private String email;

    @Size(min = 8, max = 20)
    private String oldPassword;

    @Size(min = 8, max = 20)
    private String newPassword;

    @Size(min = 8, max = 20)
    private String newMatchingPassword;
}
