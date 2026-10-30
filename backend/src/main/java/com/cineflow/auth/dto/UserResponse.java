package com.cineflow.auth.dto;

import java.util.UUID;

public record UserResponse(UUID id, String displayName, String email) {}
