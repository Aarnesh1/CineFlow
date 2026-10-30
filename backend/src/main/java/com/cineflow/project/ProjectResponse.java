package com.cineflow.project;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
    UUID id,
    String title,
    String description,
    String genre,
    String language,
    String status,
    Instant createdAt
) {}    