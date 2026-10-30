
package com.cineflow.auth.repository;

import com.cineflow.auth.entity.ScreenplayScene;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScreenplaySceneRepository
        extends JpaRepository<ScreenplayScene, UUID> {

    List<ScreenplayScene> findAllByProjectIdOrderBySceneNumberAsc(
            UUID projectId
    );

    Optional<ScreenplayScene> findByIdAndProjectId(
            UUID id,
            UUID projectId
    );

    int countByProjectId(UUID projectId);
}
