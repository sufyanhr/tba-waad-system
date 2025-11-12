package com.waad.tba.config;

import com.waad.tba.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ✅ السماح لواجهات Swagger و OpenAPI بدون توثيق
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // ✅ السماح لطلبات التسجيل والدخول
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**"
                        ).permitAll()

                        // ✅ باقي الطلبات تحتاج JWT
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore((req, res, chain) -> {
                    HttpServletRequest request = (HttpServletRequest) req;
                    HttpServletResponse response = (HttpServletResponse) res;

                    String path = request.getServletPath();

                    // ✅ تجاهل فلتر JWT لمسارات التسجيل والدخول
                    if (path.startsWith("/api/auth/")) {
                        chain.doFilter(request, response);
                        return;
                    }

                    jwtAuthFilter.doFilter(request, response, chain);
                }, UsernamePasswordAuthenticationFilter.class);




        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
