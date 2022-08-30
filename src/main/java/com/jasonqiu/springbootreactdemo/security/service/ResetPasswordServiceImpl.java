package com.jasonqiu.springbootreactdemo.security.service;

import javax.validation.Valid;

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
public class ResetPasswordServiceImpl implements ResetPasswordService {
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
        if (user == null) {
            /**
             * the user exists
             * do not send the token
             */
            log.error("user with email {} does not exist", email);
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
                    "The number of requested tokens has reached the limit (3 tokens per hour).");
        }
        String token = TokenUtils.generate();
        redisCache.set("reset:" + email, token, 300); // 5 mins
        log.info("token {} sent to email {}", token, email);
        /**
         * the logic/implementation of sending an email is omitted here
         */
        return true;
    }

    @Override
    public void savePassword(@Valid RegistrationModel resetModel) {
        String email = resetModel.getEmail();
        String token = redisCache.get("reset:" + email);
        if (!resetModel.getVerificationCode().equals(token)) {
            throw new RuntimeException("The verification code is wrong.");
        }

        String password = resetModel.getPassword();
        String matchingPassword = resetModel.getMatchingPassword();
        if (!password.equals(matchingPassword)) {
            throw new RuntimeException("The two passwords are not matched.");
        }

        UserInfo user = userInfoRepository.findByEmail(email);
        if (null != user) {
            userInfoRepository.changePassword(user.getId(), passwordEncoder.encode(password));; // save password to database

            log.info("The password of user {} is saved", user.toString());
        } else {
            throw new RuntimeException("The account does not exist.");
        }
    }


}
