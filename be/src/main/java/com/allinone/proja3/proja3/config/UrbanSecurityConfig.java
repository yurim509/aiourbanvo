package com.allinone.proja3.proja3.config;

import com.allinone.proja3.proja3.security.*;
import com.allinone.proja3.proja3.util.JWTCheckFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class UrbanSecurityConfig {
    private final UrbanUserDetailsService urbanUserDetailsService; // 주입된 UrbanUserDetailsService

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("Security Config");

        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(configurationSource());
        });

        http.sessionManagement(sessionConfig ->
                sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.csrf(AbstractHttpConfigurer::disable);

        // 권한 설정 및 인증
        //--------------------------------------------------------------
        http.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/user/login").permitAll()  // 인증 없이 접근 허용
                        .requestMatchers("/api/main/**").permitAll()
                        .requestMatchers("/api/communities/**").permitAll()
                        .requestMatchers("/upload/**").permitAll() // 이미지 인증 없이 접근 허용
                        .requestMatchers("/ws/chat").permitAll()// 웹소켓 허용
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "ROOT") // 접근 권한 설정
                        .requestMatchers("/api/parking/**").hasAnyRole("USER", "ADMIN", "ROOT") // 접근 권한 설정
                        .requestMatchers("/api/superAdmin/**").hasRole("ROOT") // 접근 권한 설정
                        .anyRequest().authenticated()  // 그 외의 요청은 인증 필요
                )

                .addFilterAt(customAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class) // JWT 인증
                .addFilterAfter(new JWTCheckFilter(),
                        UsernamePasswordAuthenticationFilter.class);  // 비밀번호 인증
        //--------------------------------------------------------------

        http.exceptionHandling(exceptionHandling -> {
            exceptionHandling.accessDeniedHandler(new UrbanAccessDeniedHandler())  // 권한 부족 사용자 처리
                    .authenticationEntryPoint(new UrbanAuthenticationEntryPoint()); // 인증되지 않은 사용자 처리
        });


        return http.build();
    }

    // 커스텀 Authentication Filter 설정
    //--------------------------------------------------------------
    @Bean
    public UrbanUsernamePasswordAuthenticationFilter customAuthenticationFilter() throws Exception {
        UrbanUsernamePasswordAuthenticationFilter filter = new UrbanUsernamePasswordAuthenticationFilter();
        filter.setAuthenticationManager(authenticationManager());
        filter.setFilterProcessesUrl("/api/user/login"); // 로그인 경로 설정
        filter.setAuthenticationSuccessHandler(new APILoginSuccessHandler());
        return filter;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return authentication -> {
            UserDetails user = urbanUserDetailsService.loadUserByUsername(authentication.getName());  // 필드 사용
            if (user == null || !passwordEncoder().matches(authentication.getCredentials().toString(), user.getPassword())) {
                throw new BadCredentialsException("Invalid credentials");
            }
            return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        };
    }
    //--------------------------------------------------------------

    @Bean
    public CorsConfigurationSource configurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 인증 정보 허용(쿠키, 세션 ID, Authorization 헤더...)
        configuration.setAllowCredentials(true);
        // 출처 패턴 : 전부 허용
        configuration.setAllowedOriginPatterns(List.of("*"));
        // CORS 요청 시 허용 출처
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // CORS 요청 시 허용 메서드
        configuration.setAllowedMethods(List.of("GET", "POST","PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"));
        // CORS 요청 시 허용 헤더
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 암호 알고리즘
    }
}