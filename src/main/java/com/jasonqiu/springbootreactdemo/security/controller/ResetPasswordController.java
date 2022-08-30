package com.jasonqiu.springbootreactdemo.security.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jasonqiu.springbootreactdemo.security.model.EmailModel;
import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;
import com.jasonqiu.springbootreactdemo.security.service.ResetPasswordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reset")
@RequiredArgsConstructor
public class ResetPasswordController {

    private final ResetPasswordService resetPasswordService;
    
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailModel emailModel) {
        try {
            boolean ret = resetPasswordService.sendToken(emailModel.getEmail());
            if (ret) {
                return ResponseEntity.ok().body("The verification code is sent to your email address. The code expires in five minutes.");
            } else {
                return ResponseEntity.badRequest().body("Your account does not exist. Please register first.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification code not sent: " + e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody @Valid RegistrationModel resetModel) {
        try {
            resetPasswordService.savePassword(resetModel);
            return ResponseEntity.ok().body("Password saved!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Reset failed: " + e.getMessage());
        }
    }
}
