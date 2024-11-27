package com.allinone.proja3.proja3.security;


import com.allinone.proja3.proja3.dto.AuthUserDTO;
import com.allinone.proja3.proja3.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 인증 성공 시 호출
        System.out.println("Success Authentication....." + authentication);

        AuthUserDTO dto = (AuthUserDTO) authentication.getPrincipal();
        Map<String, Object> claims = dto.getClaims();
        String accessToken = JWTUtil.generateToken(claims, 60*24); // 개발환경을 위해 24시간으로 임시 설정 >> 추후 10분으로 변경
        String refreshToken = JWTUtil.generateToken(claims, 60*24); // 24시간
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        Gson gson = new Gson();
        String json = gson.toJson(claims);
        response.setContentType("application/json; charset=utf-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(json);
        printWriter.close();
    }
}
