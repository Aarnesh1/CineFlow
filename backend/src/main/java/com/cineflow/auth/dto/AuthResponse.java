package com.cineflow.auth.dto;

import java.util.UUID;

public record AuthResponse(String token, String tokenType, UUID userId, String displayName, String email) {}
