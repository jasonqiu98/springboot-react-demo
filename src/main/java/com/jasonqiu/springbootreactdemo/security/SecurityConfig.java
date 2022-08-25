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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.jasonqiu.springbootreactdemo.security.filter.JwtAuthenticationTokenFilter;

/**
 * https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter
 * https://stackoverflow.com/questions/72381114/spring-security-upgrading-the-deprecated-websecurityconfigureradapter-in-spring
 * 
 * ---------------
 * CORS:
 * https://blog.csdn.net/pengjunlee/article/details/107076735 (Content in
 * Chinese)
 * https://www.jianshu.com/p/596157f3c93c (Content in Chinese)
 * https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-cors
 * https://docs.spring.io/spring-security/reference/reactive/integrations/cors.html
 * (official docs)
 * https://www.cnblogs.com/kenx/p/15201283.html#spring-security%E5%90%AF%E7%94%A8cors%E6%94%AF%E6%8C%81
 */

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true) // used for authorization
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
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable() // allow cors and disable csrf
                // retrieve SecurityContext without Session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // allow anonymous access of the register and login service
                .antMatchers("/register/**", "/user/login").anonymous()
                // only admin (developers, managers) can access the API docs
                .mvcMatchers("/swagger-ui", "/api-docs").hasAuthority("admin")
                // for all other requests, authentication is required
                .anyRequest().authenticated();

        // Other methods include:
        // formLogin()
        // loginPage() - default page for login
        // loginProcessingUrl() - the action of the frontend page
        // usernameParamter(), passwordParamter()
        // successForwardUrl() - authentication success, forward to a new path (always)
        // defaultSuccessUrl() - redirect to previously saved request (if exists) or the
        // default url specified here;
        // the second parameter indicates "alwaysUse"
        // successHandler() - an authenticationSuccessHandler

        /**
         * add our jwt filter before UsernamePasswordAuthenticationFilter
         */
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        /**
         * the url of the frontend domain
         */
        final String FRONTEND_URL = "http://localhost:3000";

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOriginPattern(FRONTEND_URL);
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
