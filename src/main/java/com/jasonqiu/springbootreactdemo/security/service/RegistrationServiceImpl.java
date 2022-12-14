package com.jasonqiu.springbootreactdemo.security.service;

import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jasonqiu.springbootreactdemo.security.entity.UserInfo;
import com.jasonqiu.springbootreactdemo.security.model.RegistrationModel;
import com.jasonqiu.springbootreactdemo.security.redis.RedisCache;
import com.jasonqiu.springbootreactdemo.security.repository.UserInfoRepository;
import com.jasonqiu.springbootreactdemo.security.utils.TokenUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RegistrationServiceImpl implements RegistrationService {

    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisCache redisCache;

    /**
     * send a token to the provided email
     * put in Redis (one hour expiry)
     * and count the number of tokens to that email
     */
    @Override
    public boolean sendToken(String email) {
        UserInfo user = userInfoRepository.findByEmail(email);
        if (user != null) {
            /**
             * the user exists
             * do not send the token
             */
            log.error("user with email {} already exists", email);
            return false;
        }
        String countKey = "tokenCount:" + email;
        Integer count = redisCache.get(countKey);
        if (null == count) {
            redisCache.set(countKey, 1, 3600);
        } else if (count <= 2) {
            redisCache.set(countKey, count + 1, 3600);
        } else {
            throw new RuntimeException(
                "The number of requested tokens has reached the limit (3 tokens per hour)."
            );
        }
        String token = TokenUtils.generate();
        redisCache.set("register:" + email, token, 300);  // 5 mins
        log.info("token {} sent to email {}", token, email);
        /**
         * the logic/implementation of sending an email is omitted here
         */
        return true;
    }

    @Override
    public UserInfo register(RegistrationModel registrationModel) {
        String email = registrationModel.getEmail();
        String token = redisCache.get("register:" + email);
        if (!registrationModel.getVerificationCode().equals(token)) {
            throw new RuntimeException("The verification code is wrong.");
        }

        String password = registrationModel.getPassword();
        String matchingPassword = registrationModel.getMatchingPassword();
        if (!password.equals(matchingPassword)) {
            throw new RuntimeException("The two passwords are not matched.");
        }

        UserInfo user = userInfoRepository.findByEmail(email);
        if (null == user) {
            user = new UserInfo();

            user.setEmail(email);
            user.setFirstName(registrationModel.getFirstName());
            user.setLastName(registrationModel.getLastName());

            /**
             * required attributes in UserInfo:
             * (username, password, role, enabled)
             */
            user.setUsername(TokenUtils.generate()); // a random username
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(2); // client by default, role with most limited authorities
            user.setEnabled(1); // enabled by default

            user.setCreatedAt(new Date());

            userInfoRepository.save(user); // save to database

            log.info(user.toString() + " saved to database");
        } else {
            throw new RuntimeException("The account already exists.");
        }

        return user;
    }
}
