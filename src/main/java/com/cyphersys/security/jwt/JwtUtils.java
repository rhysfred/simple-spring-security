package com.cyphersys.security.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.cyphersys.security.SimpleUserDetails;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${taxman.security.jwtsecret:}")
    private String jwtSecret;

    private SecretKey key;

    @Value("${taxman.security.jwtsecondstolive:600}")
    private int jwtSecondsToLive;

    public String generateJwtToken(Authentication authentication) {

        SimpleUserDetails userPrincipal = (SimpleUserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .subject((userPrincipal.getUsername()))
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + (jwtSecondsToLive*1000)))
                .signWith(key(), Jwts.SIG.HS512)
                .compact();
    }

    private SecretKey key() {
        if (key != null) {
            return key;
        }
        if (!jwtSecret.trim().equals("")) {
            key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            return key;
        }
        key = Jwts.SIG.HS512.key().build();
        return key;
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();
    }
    
    public Boolean isCurrent(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getExpiration().after(new Date()); 
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
