package com.jasonqiu.springbootreactdemo.security.utils;

import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * A utility class for JWT (Json Web Token)
 * JWT: Header + Payload + Signature
 * https://zhuanlan.zhihu.com/p/395273289 (content in Chinese)
 */

@Service
public class JwtUtils {

    /**
     * the default time to live (ttl) of jwt - one hour
     */
    private final Long JWT_TTL = 60 * 60 * 1000L;

    /**
     * the plain text of the secret key
     */
    private final String SECRET_KEY_PLAIN_TEXT = "jasonqiu98tudelft";

    /**
     * secret key -> key in byte array
     * -> (Base 64) encoded key -> (AES encrypted) secret key
     */
    private SecretKey getSecretKey() {
        byte[] keyByteArray = SECRET_KEY_PLAIN_TEXT.getBytes();
        byte[] encodedKey = Base64.getEncoder().encode(keyByteArray);
        SecretKey secretKey = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        return secretKey;
    }

    /**
     * generate a new random UUID and remove all the dash symbols within the uuid
     * e.g. generate a new uuid "02c9363a-3dba-45f2-939e-ef0c472a903e". and
     * @return "02c9363a3dba45f2939eef0c472a903e"
     */
    private String getRandomUUID() {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        return uuid;
    }

    /**
     * the jwt builder with three args
     * @param subject the json data of jwt (json format in string)
     * @param ttlMs time to live (ttl, in ms) of jwt
     * @param uuid unique uid
     * @return
     */
    private JwtBuilder getJwtBuilder(String subject, Long ttlMs, String uuid) {
        // if no ttl is set, use the default one
        if (null == ttlMs) {
            ttlMs = JWT_TTL;
        }
        // current timestamp in ms and date format
        long currentMs = System.currentTimeMillis();
        Date currentDate = new Date(currentMs);
        // expiry timestamp in ms and date format
        long expiryMs = currentMs + ttlMs;
        Date expiryDate = new Date(expiryMs);

        return Jwts.builder()
                .setId(uuid)
                .setSubject(subject)
                .setIssuer("chyau")
                .setIssuedAt(currentDate)
                .signWith(SignatureAlgorithm.HS256, getSecretKey())
                .setExpiration(expiryDate);
    }

    /**
     * public method
     * create token with only the subject (data), using the default ttl and random uuid
     */
    public String createToken(String subject) {
        return getJwtBuilder(subject, null, getRandomUUID()).compact();
    }

    /**
     * public method
     * create token with the subject (data) and ttl, using a random UUID
     */
    public String createToken(String subject, Long ttlMs) {
        return getJwtBuilder(subject, ttlMs, getRandomUUID()).compact();
    }

    /**
     * public method
     * create token with the subject (data), ttl and uuid
     */
    public String createToken(String subject, Long ttlMs, String uuid) {
        return getJwtBuilder(subject, ttlMs, uuid).compact();
    }

    /**
     * parse (jwt) token to claims
     * @param token the jwt token
     * @return claim with jti, sub, iss, iat and exp
     * @throws Exception
     */
    public Claims parseToken(String token) throws Exception {
        return Jwts.parser()
                .setSigningKey(getSecretKey())
                .parseClaimsJws(token)
                .getBody();
    }

}

