package com.jasonqiu.springbootreactdemo.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jasonqiu.springbootreactdemo.entity.UserLoginDetails;
import com.jasonqiu.springbootreactdemo.utils.JwtUtils;
import com.jasonqiu.springbootreactdemo.utils.RedisCache;

import io.jsonwebtoken.Claims;

@Service
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

        // parse token and retrieve UserLoginDetails from Redis

        UserLoginDetails userLoginDetails;

        try {
            Claims claims = jwtUtils.parseToken(token);
            String userId = claims.getSubject();
            String redisKey = "login:" + userId;
            userLoginDetails = redisCache.get(redisKey);
        } catch (Exception e) {
            e.printStackTrace();
            // We don't need to throw RuntimeException on the method signature
            throw new RuntimeException("invalid token");
        }

        if (null == userLoginDetails) {
            throw new RuntimeException("invalid token");
        }

        // set SecurityContextHolder and pass to subsequent filters 
        // here we use UsernamePasswordAuthenticationToken with three args
        // - principal ~ "username" / message we want to pass in the token
        // - credentials ~ "password"
        // - authorities ~ isAuthenticated() or not
        // TODO: finialze the authentication implementation
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userLoginDetails, null, null);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request, response);
    }

}
