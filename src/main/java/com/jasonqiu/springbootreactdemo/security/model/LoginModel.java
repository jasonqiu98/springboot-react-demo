package com.jasonqiu.springbootreactdemo.security.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class LoginModel {
    @NotNull
    String username;

    @NotNull
    @Size(min = 8, max = 20)
    String password;
}
