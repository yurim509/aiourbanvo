package com.allinone.proja3.proja3.util;

import com.allinone.proja3.proja3.dto.AuthUserDTO;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // preflight 요청 허용 (OPTIONS method)

        String path = request.getRequestURI();

        // login 경로 허용
        if (path.startsWith("/api/user/login")) return true;
        if (path.startsWith("/api/main")) return true;
        if (path.startsWith("/upload")) return  true; // 이미지 인증 추가
        if (path.startsWith("/ws/chat")) return true; // WebSocket 경로 허용


        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("JWT Check Filter");
        String authHeaderStr = request.getHeader("Authorization");

        try {
            String accessToken = authHeaderStr.substring(7); // "Bearer " 뒤 token 부분 추출
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            System.out.println("JWT claims : " + claims);

            // claims Transfer
            Long uno = ((Integer) claims.get("uno")).longValue();
            String dong = (String) claims.get("dong");
            String ho = (String) claims.get("ho");
            String userName = (String) claims.get("userName");
            String phone = (String) claims.get("phone");
            String pw = (String) claims.get("pw");
            boolean delFlag = (boolean) claims.get("delFlag");
            List<String> roleNames = (List<String>) claims.get("roleNames");
            roleNames.forEach(System.out::println);
            AuthUserDTO authUserDTO = new AuthUserDTO(uno,dong,ho,userName,phone,pw,delFlag,roleNames);
            System.out.println("JWT Check User Info : "+authUserDTO);
            System.out.println("JWT Check User Info Role : "+authUserDTO.getAuthorities());
            // ID(phone)/PW(pw)/권한목록(authUserDTO.getAuthorities()) 담기
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            authUserDTO, null, authUserDTO.getAuthorities());
            // SecurityContext 인증 객체에 저장
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            System.out.println("SecurityContextHolder :" + authenticationToken);

            filterChain.doFilter(request, response);
        } catch(Exception e) {
            System.out.println("JWT Check Error : "+e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.print(msg);
            printWriter.close();
        }
    }
}
