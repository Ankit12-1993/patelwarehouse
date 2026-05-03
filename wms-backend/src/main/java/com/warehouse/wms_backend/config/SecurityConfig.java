package com.warehouse.wms_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless REST APIs
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow public access to submit and manage leads/bookings for MVP demo
                .requestMatchers("/api/leads/**").permitAll()
                .requestMatchers("/api/bookings/**").permitAll()
                // Allow login/auth endpoints (to be implemented)
                .requestMatchers("/api/auth/**").permitAll()
                // Require authentication for everything else (e.g., Admin APIs)
                // Note: For MVP testing, you can change this to permitAll() if you want to test without tokens first.
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
