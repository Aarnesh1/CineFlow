
package com.cineflow.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CharacterRelationshipRequest(
    @NotNull UUID sourceCharacterId,
    @NotNull UUID targetCharacterId,

    @NotBlank
    @Size(max = 80)
    String relationshipType,

    @Size(max = 10000)
    String description
) {}
