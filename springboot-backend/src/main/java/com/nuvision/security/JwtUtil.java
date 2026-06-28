package com.nuvision.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generate(String id, String email, String role, String name) {
        return Jwts.builder()
                .subject(id)
                .claim("email", email)
                .claim("role", role)
                .claim("name", name)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key())
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }

    public boolean isValid(String token) {
        try { parse(token); return true; } catch (JwtException | IllegalArgumentException e) { return false; }
    }

    public String getId(String token)    { return parse(token).getSubject(); }
    public String getRole(String token)  { return parse(token).get("role", String.class); }
    public String getEmail(String token) { return parse(token).get("email", String.class); }
}
