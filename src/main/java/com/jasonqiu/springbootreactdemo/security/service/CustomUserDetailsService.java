package com.jasonqiu.springbootreactdemo.security.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jasonqiu.springbootreactdemo.security.entity.Role;
import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.security.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserInfoRepository userInfoRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // query the user info by username (or email)
        // here the username is the username or email
        UserInfo userInfo = userInfoRepository.findByUsername(username);
        if (null == userInfo) {
            String email = username;
            userInfo = userInfoRepository.findByEmail(email);
        }

        // if the result is null (username not found)
        // then throw an exception
        if (null == userInfo) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException("User not found in the database");
        } else {
            // from here on, username is username, excluding the possibilities of email
            username = userInfo.getUsername();
            log.info("User found in the database: {}", username);
        }

        /*
         * construct authorities to create userDetails
         * here for simplicity we only assign ONE role to each user
         * if a use has multiple roles, consider the following code
         * -------------------------------------------------------------
         * List<SimpleGrantedAuthority> authorities = new ArrayList<>();
         * userInfo.getRoles().forEach(role -> {
         * authorities.add(
         * new SimpleGrantedAuthority(role.getName())
         * );
         * });
         * -------------------------------------------------------------
         */
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        String role = Role.roleMap.get(userInfo.getRole());
        authorities.add(new SimpleGrantedAuthority(role));

        String password = userInfo.getPassword();
        boolean enabled = userInfo.getEnabled().intValue() == 1;

        User userDetails = new User(
                username,
                password,
                enabled,
                true,
                true,
                true,
                authorities);

        return userDetails;
    }
}
