
package com.cineflow.auth.repository;

import com.cineflow.auth.entity.ProjectCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectCharacterRepository
        extends JpaRepository<ProjectCharacter, UUID> {

    List<ProjectCharacter> findAllByProjectIdOrderByNameAsc(
            UUID projectId
    );

    Optional<ProjectCharacter> findByIdAndProjectId(
            UUID id,
            UUID projectId
    );
}
