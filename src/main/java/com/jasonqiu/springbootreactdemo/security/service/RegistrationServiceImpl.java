package com.jasonqiu.springbootreactdemo.security.service;

import java.util.Date;

import javax.management.RuntimeErrorException;

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
                "The count of tokens sent to the user has reached the maximum (3 tokens per hour)."
            );
        }
        String token = TokenUtils.generate();
        redisCache.set("register:" + email, token, 300);
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

    // /**
    //  * create token by userId and store into Redis
    //  */
    // @Override
    // public String sendToken(String email, Long userId) {
    //     String countKey = "tokenCount:" + email;
    //     Integer count = redisCache.get(countKey);
    //     if (null == count) {
    //         redisCache.set(countKey, 1, 3600);
    //     } else if (count <= 2) {
    //         redisCache.set(countKey, count + 1, 3600);
    //     } else {
    //         throw new RuntimeException(
    //             "The count of tokens sent to the user has reached the maximum (3 tokens per hour)."
    //         );
    //     }
    //     String token = TokenUtils.generate();
    //     redisCache.set(token, userId, 300);
    //     log.info("token saved to user with id {}", userId);
    //     return token;
    // }

    // /**
    //  * create token by userId and store into Redis
    //  */
    // @Override
    // public String resendToken(String email, String token) {
    //     // id from redis will be cast to Integer
    //     Integer idFromRedis = redisCache.get(token);
    //     Long userId = Long.valueOf((long) idFromRedis.intValue());
    //     if (null == userId) {
    //         return "";
    //     } else {
    //         token = TokenUtils.generate();
    //         redisCache.set(token, userId, 300);
    //         log.info("token saved to user with id {}", userId);
    //         return token;
    //     }
    // }

    // /**
    //  * return:
    //  * false - invalid or expired
    //  * true - valid
    //  */
    // @Override
    // public boolean validateToken(String token) {
    //     Integer idFromRedis = redisCache.get(token);
    //     Long userId = Long.valueOf((long) idFromRedis.intValue());
    //     if (null == userId) {
    //         return false; // invalid or expired
    //     }

    //     redisCache.delete(token);

    //     // enable the (valid) user
    //     userInfoRepository.enableUser(userId);
    //     return true;
    // }

    // @Override
    // public UserInfo findUserByEmail(String email) {
    //     return userInfoRepository.findByEmail(email);
    // }

    // @Override
    // public byte resetPassword(String token, String newPassword) {
    //     Integer idFromRedis = redisCache.get(token);
    //     Long userId = Long.valueOf((long) idFromRedis.intValue());
    //     if (null == userId) {
    //         return 0; // invalid or expired
    //     }

    //     // whether user is enabled or not
    //     Integer ret = userInfoRepository.enabled(userId);
    //     if (ret == null) {
    //         return 1; // user not found
    //     }

    //     if (ret.intValue() != 1) {
    //         return 2; // user disabled
    //     }

    //     userInfoRepository.changePassword(userId, passwordEncoder.encode(newPassword));
    //     return 3; // success
    // }

    // @Override
    // public byte changePassword(String email, String oldPassword, String newPassword) {
    //     UserInfo user = userInfoRepository.findByEmail(email);
    //     if (null == user) {
    //         return 0; // user not found
    //     }

    //     // whether the old password is correct or not
    //     boolean ret = passwordEncoder.matches(oldPassword, user.getPassword());
    //     if (!ret) {
    //         return 1; // invalid old password
    //     }

    //     userInfoRepository.changePassword(user.getId(), passwordEncoder.encode(newPassword));
    //     return 2; // success
    // }
}
