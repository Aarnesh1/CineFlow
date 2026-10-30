
package com.cineflow.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record SceneResponse(
        UUID id,
        UUID projectId,
        Integer sceneNumber,
        String title,
        String content,
        Instant createdAt,
        Instant updatedAt
) {}
