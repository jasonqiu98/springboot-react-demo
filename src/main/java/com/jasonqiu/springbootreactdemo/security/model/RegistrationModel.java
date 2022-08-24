package com.jasonqiu.springbootreactdemo.security.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated  // enable JSR303 data validation
public class RegistrationModel {
    @Email
    private String email;
    private String firstName;
    private String lastName;

    @Size(min = 8, max = 20)
    private String password;

    @Size(min = 8, max = 20)
    private String matchingPassword;
}
