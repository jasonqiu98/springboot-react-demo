package com.jasonqiu.springbootreactdemo.security.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated
public class EmailModel {

    @NotBlank
    @Email
    private String email;
}
