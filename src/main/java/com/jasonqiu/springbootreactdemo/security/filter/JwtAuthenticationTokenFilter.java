package com.jasonqiu.springbootreactdemo.security.filter;

import java.io.IOException;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jasonqiu.springbootreactdemo.security.entity.UserDetailsPackage;
import com.jasonqiu.springbootreactdemo.security.redis.RedisCache;
import com.jasonqiu.springbootreactdemo.security.utils.JwtUtils;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    final JwtUtils jwtUtils;

    final RedisCache redisCache;

    public JwtAuthenticationTokenFilter(JwtUtils jwtUtils, RedisCache redisCache) {
        this.jwtUtils = jwtUtils;
        this.redisCache = redisCache;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // retrieve token
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)) {
            // do not set any SecurityContextHolder
            filterChain.doFilter(request, response);
            return;
        }

        // parse token and retrieve Authentication from Redis

        String redisKey;

        try {
            Claims claims = jwtUtils.parseToken(token);
            String username = claims.getSubject();
            redisKey = "login:" + username;
            log.info("redisKey: {}", redisKey);
        } catch (Exception e) {
            e.printStackTrace();
            // We don't need to throw RuntimeException on the method signature
            throw new RuntimeException("invalid token");
        }

        UserDetailsPackage user;

        try {
            user = redisCache.get(redisKey);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("cannot read from redis");
        }

        // if the Authentication is not found in redis
        // then throw an exception
        if (null == user) {
            throw new RuntimeException("invalid token");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getUsername(), 
            user.getPassword(),
            user.getAuthorities().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
        );

        // set SecurityContextHolder and pass to subsequent filters
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("Retrieved user info of {} from Redis with authorities {}",
            authentication.getPrincipal(),
            authentication.getAuthorities()
        );
        filterChain.doFilter(request, response);
    }

}
