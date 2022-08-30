/**
 * borrowed (and modified) from
 * https://github.com/shabbirdwd53/spring-security-tutorial/blob/main/spring-security-client/src/main/java/com/dailycodebuffer/client/controller/RegistrationController.java
 */

package com.jasonqiu.springbootreactdemo.security.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Email;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.security.model.EmailModel;
import com.jasonqiu.springbootreactdemo.security.model.PasswordModel;
import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;
import com.jasonqiu.springbootreactdemo.security.service.RegistrationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * https://blog.csdn.net/suki_rong/article/details/80445880
 * (content in Chinese)
 */

@RestController
@Slf4j
@RequestMapping("/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * send 
     * @return
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody @Valid EmailModel emailModel) {
        boolean ret = registrationService.sendToken(emailModel.getEmail());
        if (ret) {
            return ResponseEntity.ok().body("The verification code is sent to your email address.");
        } else {
            return ResponseEntity.badRequest().body("Your account already exists. Please log in with your email or username.");
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

    // @GetMapping("/verify")
    // public ResponseEntity<String> verifyRegistration(@RequestParam("token") String token) {
    //     boolean ret = registrationService.validateToken(token);
    //     if (ret) {
    //         log.info("Registration Verified");
    //         return ResponseEntity.ok().body("Registration Verified");
    //     }
    //     return ResponseEntity.badRequest().body("Link Invalid or Expired");
    // }

    // @GetMapping("/resend")
    // public ResponseEntity<String> resendVerificationToken(@RequestParam("token") String oldToken,
    //         HttpServletRequest request) {
        
    //     if (newToken.equals("")) {
    //         return ResponseEntity.badRequest().body("Link Invalid or Expired");
    //     } else {
    //         sendVerificationMail(applicationUrl(request), newToken);
    //         return ResponseEntity.ok().body("Link Resent");
    //     }
    // }

    // @PostMapping("/resetPassword")
    // public ResponseEntity<String> resetPassword(@RequestBody PasswordModel passwordModel, HttpServletRequest request) {
    //     /**
    //      * Only the email is expected in the passwordModel
    //      */
    //     UserInfo user = registrationService.findUserByEmail(passwordModel.getEmail());
    //     if (user != null) {
    //         // send an email
    //         String token = registrationService.sendToken(user.getId());
    //         sendResetPasswordMail(applicationUrl(request), token);
    //         return ResponseEntity.ok().body("Link Sent");
    //     } else {
    //         return ResponseEntity.badRequest().body("Email Invalid");
    //     }
    // }

    // @PostMapping("/savePassword")
    // public ResponseEntity<String> savePassword(@RequestParam("token") String token,
    //         @RequestBody PasswordModel passwordModel) {
    //     /**
    //      * (email, newPassword, newMatchingPassword) is expected
    //      */
    //     if (!passwordModel.getNewPassword().equals(passwordModel.getNewMatchingPassword())) {
    //         return ResponseEntity.badRequest().body("Passwords Not Matched");
    //     }
    //     boolean ret = registrationService.validateToken(token);
    //     if (ret) {
    //         byte resetPasswordStatus = registrationService.resetPassword(token, passwordModel.getNewPassword());
    //         switch (resetPasswordStatus) {
    //             case 0:
    //                 return ResponseEntity.badRequest().body("Link Invalid or Expired");
    //             case 1:
    //                 return ResponseEntity.badRequest().body("User Not Found");
    //             case 2:
    //                 return ResponseEntity.badRequest().body("User Currently Disabled");
    //             case 3:
    //                 return ResponseEntity.ok().body("Password Reset Successfully");
    //             default:
    //                 return ResponseEntity.badRequest().body("Bad Request");
    //         }
    //     } else {
    //         return ResponseEntity.badRequest().body("Link Invalid or Expired");
    //     }
    // }

    // @PostMapping("/changePassword")
    // public ResponseEntity<String> changePassword(@RequestBody PasswordModel passwordModel) {
    //     /**
    //      * (email, oldPassword, newPassword, newMatchingPassword) is expected
    //      */
    //     if (!passwordModel.getNewPassword().equals(passwordModel.getNewMatchingPassword())) {
    //         return ResponseEntity.badRequest().body("Passwords Not Matched");
    //     }

    //     byte changePasswordStatus = registrationService.changePassword(
    //             passwordModel.getEmail(),
    //             passwordModel.getOldPassword(),
    //             passwordModel.getNewPassword());

    //     switch (changePasswordStatus) {
    //         case 0:
    //             return ResponseEntity.badRequest().body("User Not Found");
    //         case 1:
    //             return ResponseEntity.badRequest().body("Invalid Old Password");
    //         case 2:
    //             return ResponseEntity.ok().body("Password Changed Successfully");
    //         default:
    //             return ResponseEntity.badRequest().body("Bad Request");
    //     }
    // }

    // /**
    //  * for testing of CORS
    //  */

    // // @GetMapping("/hello")
    // // public ResponseEntity<String> hello() {
    // //     return ResponseEntity.ok().body("hello");
    // // }

    // private void sendVerificationMail(String applicationUrl, String email, Long id) {
    //     // TODO: replace with frontend url and let frontend access backend

    //     String token = registrationService.sendToken(email, id);

    //     String url = applicationUrl + "/register/verify?token=" + token;
    //     log.info("[{}] Click the link to verify your account: {}", email, url);
    // }

    // private void sendResetPasswordMail(String applicationUrl, String email, Long id) {
    //     // TODO: replace with frontend url, allow the user to input password info on frontend
    //     //       and finally frontend accesses backend to finish the operation of "save password"

    //     String newToken = registrationService.resendToken(oldToken);
        
    //     String url = applicationUrl + "/register/resetPassword?token=" + token;
    //     log.info("[{}] You are trying to reset your password. Click the link to save your new password: {}", email, url);
    // }

    // private String applicationUrl(HttpServletRequest request) {
    //     return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    // }

}
