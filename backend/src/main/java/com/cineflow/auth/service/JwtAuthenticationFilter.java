
package com.cineflow.auth.service;

import com.cineflow.auth.entity.AppUser;
import com.cineflow.auth.repository.AppUserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final AppUserRepository users;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            AppUserRepository users) {
        this.jwtService = jwtService;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        boolean bearerPresent =
                header != null && header.startsWith("Bearer ");

        log.debug(
                "JWT filter: method={}, path={}, bearerPresent={}",
                request.getMethod(),
                path,
                bearerPresent
        );

        if (bearerPresent
                && SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            String token = header.substring(7).trim();

            if (token.isEmpty()) {
                rejectInvalidToken(response, "Empty Bearer token");
                return;
            }

            try {
                String subject = jwtService.extractSubject(token);

                UUID userId = UUID.fromString(subject);

                AppUser user = users.findById(userId).orElse(null);

                if (user == null) {
                    log.warn(
                            "JWT rejected: no user found for token subject."
                    );

                    response.sendError(
                            HttpServletResponse.SC_UNAUTHORIZED,
                            "Invalid authentication token"
                    );
                    return;
                }

                var principal = User.withUsername(user.getEmail())
                        .password("")
                        .authorities("ROLE_USER")
                        .build();

                var authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                principal.getAuthorities()
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                request.setAttribute("cineflow.userId", userId);

                log.debug(
                        "JWT accepted; authenticated user ID attribute set."
                );

            } catch (JwtException | IllegalArgumentException ex) {
                log.warn(
                        "JWT rejected: validation/parsing failed ({})",
                        ex.getClass().getSimpleName()
                );

                SecurityContextHolder.clearContext();

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired authentication token"
                );
                return;
            }
        } else if (!bearerPresent) {
            log.debug(
                    "No Bearer token supplied for {} {}",
                    request.getMethod(),
                    path
            );
        }

        chain.doFilter(request, response);
    }

    private void rejectInvalidToken(
            HttpServletResponse response,
            String message) throws IOException {

        SecurityContextHolder.clearContext();

        response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                message
        );
    }
}
