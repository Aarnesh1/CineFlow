
package com.cineflow.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CharacterRequest(
        @NotBlank(message = "Character name is required")
        @Size(max = 150, message = "Character name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Character role is required")
        @Size(max = 80, message = "Character role must not exceed 80 characters")
        String characterRole,

        @Size(max = 10000, message = "Description is too long")
        String description,

        @Size(max = 10000, message = "Personality is too long")
        String personality,

        @Size(max = 20000, message = "Backstory is too long")
        String backstory
) {}
