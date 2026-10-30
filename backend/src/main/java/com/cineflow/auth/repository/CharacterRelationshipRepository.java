
package com.cineflow.auth.repository;

import com.cineflow.auth.entity.CharacterRelationship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CharacterRelationshipRepository
        extends JpaRepository<CharacterRelationship, UUID> {

    List<CharacterRelationship>
        findAllByProjectIdOrderByCreatedAtDesc(UUID projectId);

    Optional<CharacterRelationship>
        findByIdAndProjectId(UUID id, UUID projectId);
}
