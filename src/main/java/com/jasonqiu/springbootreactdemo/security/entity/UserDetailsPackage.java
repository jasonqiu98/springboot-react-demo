package com.jasonqiu.springbootreactdemo.security.entity;

import java.util.Set;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Used as a package class to pass into Redis
 * Including the same info as UserDetails
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonSerialize
public class UserDetailsPackage {
    private String username;
    private String password;
    private Set<String> authorities;
}
