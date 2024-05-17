package com.cyphersys.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.cyphersys.security.jwt.AuthEntryPointJwt;
import com.cyphersys.security.jwt.AuthTokenFilter;

import io.jsonwebtoken.lang.Arrays;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    SimpleUserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Value("${com.cyphersys.security.public-url-patterns:}")
    private String publicPatterns;

    @Bean
    AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        List<String> patterns = new ArrayList<String>();
        if (publicPatterns != "") {
            patterns.addAll(Arrays.asList(publicPatterns.split(",\\s*")));
        } else {
            patterns.add("/api/security/public/**");
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
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

//.requestMatchers("/api/security/public/**", "/", "/index.html", "/static/**", "/favicon.ico",
//"/manifest.json", "/logo*.png", "/error")
//.permitAll()