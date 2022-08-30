/**
 * borrowed (and modified) from
 * https://github.com/shabbirdwd53/spring-security-tutorial/blob/main/spring-security-client/src/main/java/com/dailycodebuffer/client/controller/RegistrationController.java
 */

package com.jasonqiu.springbootreactdemo.security.controller;

import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.security.model.EmailModel;
import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;
import com.jasonqiu.springbootreactdemo.security.service.RegistrationService;

import lombok.RequiredArgsConstructor;

/**
 * https://blog.csdn.net/suki_rong/article/details/80445880
 * (content in Chinese)
 */

@RestController
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * send
     * 
     * @return
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody @Valid EmailModel emailModel) {
        try {
            boolean ret = registrationService.sendToken(emailModel.getEmail());
            if (ret) {
                return ResponseEntity.ok()
                        .body("The verification code is sent to your email address. The code expires in five minutes.");
            } else {
                return ResponseEntity.badRequest()
                        .body("Your account already exists. Please log in with your email or username.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification code not sent: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationModel registrationModel) {
        try {
            UserInfo user = registrationService.register(registrationModel);
            return ResponseEntity.ok().body("Registration Successful! Your username: " + user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

}
