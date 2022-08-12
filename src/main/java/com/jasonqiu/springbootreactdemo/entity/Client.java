package com.jasonqiu.springbootreactdemo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class Client {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Integer gender;
}
