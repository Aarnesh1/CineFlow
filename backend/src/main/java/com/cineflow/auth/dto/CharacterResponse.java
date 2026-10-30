
package com.cineflow.auth.dto;

import com.cineflow.auth.entity.ProjectCharacter;
import java.time.Instant;
import java.util.UUID;

public record CharacterResponse(
        UUID id,
        UUID projectId,
        String name,
        String characterRole,
        String description,
        String personality,
        String backstory,
        Instant createdAt,
        Instant updatedAt
) {
    public static CharacterResponse from(ProjectCharacter character) {
        return new CharacterResponse(
                character.getId(),
                character.getProjectId(),
                character.getName(),
                character.getCharacterRole(),
                character.getDescription(),
                character.getPersonality(),
                character.getBackstory(),
                character.getCreatedAt(),
                character.getUpdatedAt()
        );
    }
}
