package com.jasonqiu.springbootreactdemo.security.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jasonqiu.springbootreactdemo.security.model.LoginModel;
import com.jasonqiu.springbootreactdemo.security.service.LoginService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginModel loginModel) {
        // username or email
        String username = loginModel.getUsername();
        String password = loginModel.getPassword();
        return loginService.login(username, password);
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        if (loginService.logout()) {
            return ResponseEntity.ok().body("Logout Success");
        } else {
            return ResponseEntity.badRequest().body("Logout Failed");
        }

    }

}
