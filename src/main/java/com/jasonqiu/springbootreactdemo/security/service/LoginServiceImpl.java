package com.jasonqiu.springbootreactdemo.security.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.jasonqiu.springbootreactdemo.security.entity.UserDetailsPackage;
import com.jasonqiu.springbootreactdemo.security.redis.RedisCache;
import com.jasonqiu.springbootreactdemo.security.utils.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Client
 * --------------------------------------------------------------------
 * AbstractAuthenticationProcessingFilter (Filters)
 * AuthenticationManager
 * AbstractUserDetailsAuthenticationProvider (Authentication Provider)
 * UserDetailsService
 * --------------------------------------------------------------------
 * Database
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginServiceImpl implements LoginService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RedisCache redisCache;

    @Override
    public ResponseEntity<UserDetailsPackage> login(String username, String password) {
        // here username is username or email
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            log.error(e.toString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails user = (UserDetails) authentication.getPrincipal();

        username = user.getUsername();
        password = user.getPassword();
        Set<String> authorities = user.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String token = jwtUtils.createToken(username);

        UserDetailsPackage ret = new UserDetailsPackage(username, password, authorities);

        redisCache.set("login:" + username, ret);

        log.info("Login Success with redisKey: {}", "login:" + username);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, token)
                .header("Access-Control-Expose-Headers", HttpHeaders.AUTHORIZATION)
                .body(ret);
    }

    @Override
    public boolean logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (String) authentication.getPrincipal();
        boolean ret = redisCache.delete("login:" + username);
        if (ret) {
            log.info("Entry with key login:{} deleted from Redis", username);
        }
        return ret;
    }

}
