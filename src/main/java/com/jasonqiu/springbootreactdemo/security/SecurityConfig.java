package com.jasonqiu.springbootreactdemo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jasonqiu.springbootreactdemo.security.filter.JwtAuthenticationTokenFilter;

/**
 * https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter
 * https://stackoverflow.com/questions/72381114/spring-security-upgrading-the-deprecated-websecurityconfigureradapter-in-spring
 */

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)  // used for authorization
public class SecurityConfig {

    final JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    public SecurityConfig(JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter) {
        this.jwtAuthenticationTokenFilter = jwtAuthenticationTokenFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // retrieve SecurityContext without Session
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            // allow anonymous access of the register and login service
            .antMatchers("/register/**", "/user/login").anonymous()
            // only admin (developers, managers) can access the API docs
            .mvcMatchers("/swagger-ui", "/api-docs").hasAuthority("admin")
            // for all other requests, authentication is required
            .anyRequest().authenticated()
            .and()
            .csrf().disable(); // disable csrf

        // Other methods include:
        // formLogin()
        // loginPage() - default page for login
        // loginProcessingUrl() - the action of the frontend page
        // usernameParamter(), passwordParamter()
        // successForwardUrl() - authentication success, forward to a new path (always)
        // defaultSuccessUrl() - redirect to previously saved request (if exists) or the default url specified here;
        //                       the second parameter indicates "alwaysUse"
        // successHandler() - an authenticationSuccessHandler

        /**
         * add our jwt filter before UsernamePasswordAuthenticationFilter
         */
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
