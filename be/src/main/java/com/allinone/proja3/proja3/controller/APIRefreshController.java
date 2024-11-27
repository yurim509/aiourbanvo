package com.allinone.proja3.proja3.controller;

import com.allinone.proja3.proja3.util.JWTUtil;
import com.allinone.proja3.proja3.util.UrbanJWTException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class APIRefreshController {
    @RequestMapping("/api/user/login/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken){
        if (refreshToken == null) throw new UrbanJWTException(("NULL_REFRESH"));
        if (authHeader == null || authHeader.length() < 7) throw new UrbanJWTException("INVALID_STRING");
        String accessToken = authHeader.substring(7);

        // Access Token >> 만료되지 않음
        if (!checkExpiredToken(accessToken)) {
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }
        // Refresh Token 검증
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        String newAccessToken = JWTUtil.generateToken(claims, 10);
        String newRefreshToken = checkTime((Integer) claims.get("exp")) ?
                JWTUtil.generateToken(claims, 60*24) : refreshToken;
        return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    // 시간이 1시간 미만 시
    private boolean checkTime(Integer exp){
        //JWT exp 날짜로 변환
        java.util.Date expDate = new java.util.Date((long)exp * 1000);
        // 현재 시간과의 차이 계산 (ms)
        long gap = expDate.getTime() - System.currentTimeMillis();
        // 분 단위 계산
        long leftMin = gap / (1000 * 60);
        // 1시간 미만 여부
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String token){
        try{
            JWTUtil.validateToken(token);
        }catch (UrbanJWTException ex) {
            if (ex.getMessage().equals("Expired")){
                return true;
            }
        }
        return false;
    }
}
