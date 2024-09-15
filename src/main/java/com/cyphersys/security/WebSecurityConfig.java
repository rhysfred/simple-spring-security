package com.cyphersys.security;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.cyphersys.security.jwt.AuthEntryPointJwt;
import com.cyphersys.security.jwt.AuthTokenFilter;
import com.cyphersys.security.repository.UserRepository;

import io.jsonwebtoken.lang.Arrays;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);

    
    @Autowired
    SimpleUserDetailsService userDetailsService;
    

    @Autowired
    UserRepository userRepository;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Value("${com.cyphersys.security.public-url-patterns:}")
    private String publicPatterns;

    @Bean
    AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        List<String> patterns = new ArrayList<String>();
        if (!publicPatterns.trim().equals("")) {
            logger.info("Configuring Spring Security with user-defined public url pattern");
            logger.info("Patterns: '" + publicPatterns + "'");
            patterns.addAll(Arrays.asList(publicPatterns.split(",\\s*")));
        } else {
            logger.info("Configuring Spring Security with default public url patterns");
            patterns.add("/");
            patterns.add("/index.html");
            patterns.add("/static/**");
            patterns.add("/favicon.ico");
            patterns.add("/manifest.json");
            patterns.add("/logo*.png");
            patterns.add("/error");
        }
        patterns.add("/api/security/public/**");
        
        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(patterns.toArray(new String[0]))
                        .permitAll()
                        .requestMatchers("/api/security/admin/**").hasAuthority("secadmin")
                        .anyRequest().authenticated());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}