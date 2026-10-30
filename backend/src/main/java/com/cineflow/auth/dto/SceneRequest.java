
package com.cineflow.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SceneRequest(
        @NotBlank(message = "Scene title is required")
        @Size(max = 200, message = "Scene title cannot exceed 200 characters")
        String title,

        String content
) {}
