package com.allinone.proja3.proja3.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

public class JWTUtil {
    private static final String key = "1234567890123456789012345678901234567890";
    public static String generateToken(Map<String, Object> valueMap, int min){
        SecretKey key = null;

        try{
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
        return Jwts.builder()
                .setHeader(Map.of("typ","JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(key)
                .compact();
    }

    public static Map<String, Object> validateToken(String token){
        Map<String, Object> claim = null;
        try{
            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes(StandardCharsets.UTF_8));
            claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (MalformedJwtException malformedJwtException) {
            throw new UrbanJWTException("Malformed");
        } catch (ExpiredJwtException expiredJwtException) {
            throw new UrbanJWTException("Expired");
        } catch (InvalidClaimException invalidClaimException){
            throw new UrbanJWTException("Invalid");
        } catch (JwtException jwtException){
            throw new UrbanJWTException("JWT Error");
        } catch (Exception e) {
            throw new UrbanJWTException("Error");
        }
        return claim;
    }
}
