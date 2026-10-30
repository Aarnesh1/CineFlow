
package com.cineflow.auth.dto;

import com.cineflow.auth.entity.CharacterRelationship;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CharacterRelationshipResponse(
    UUID id,
    UUID projectId,
    UUID sourceCharacterId,
    UUID targetCharacterId,
    String relationshipType,
    String description,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static CharacterRelationshipResponse from(
            CharacterRelationship relationship) {

        return new CharacterRelationshipResponse(
            relationship.getId(),
            relationship.getProjectId(),
            relationship.getSourceCharacterId(),
            relationship.getTargetCharacterId(),
            relationship.getRelationshipType(),
            relationship.getDescription(),
            relationship.getCreatedAt(),
            relationship.getUpdatedAt()
        );
    }
}
