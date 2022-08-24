package com.jasonqiu.springbootreactdemo.security.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.jasonqiu.springbootreactdemo.security.entity.Role;
import com.jasonqiu.springbootreactdemo.security.service.UserInfoService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserInfoController {

    private final UserInfoService userInfoService;
    
    @GetMapping("/username")
    public ResponseEntity<String> getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (String) authentication.getPrincipal();
        return ResponseEntity.ok().body(username);
    }

    @PostMapping("/setRole")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<String> setRoleByUsername(@RequestBody UsernameRole usernameRole) {
        String username = usernameRole.getUsername();
        Integer role = usernameRole.getRole();
        if (!Role.roleMap.keySet().contains(role)) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
        if (userInfoService.findIdByUsername(username) != null) {
            userInfoService.changeRoleByUsername(username, role);
            return ResponseEntity.ok().body("Update success");
        } else if (userInfoService.findIdByEmail(username) != null) {
            String email = username;
            userInfoService.changeRoleByEmail(email, role);
            return ResponseEntity.ok().body("Update success");
        } else {
            return ResponseEntity.badRequest().body("Invalid username");
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsernameRole {

        private String username;

        // we fix the role to only one integer instead of a list
        private Integer role;
    }
}
