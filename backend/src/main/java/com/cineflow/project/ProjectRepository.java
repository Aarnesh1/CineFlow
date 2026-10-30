package com.cineflow.project;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findAllByOwner_IdOrderByCreatedAtDesc(UUID ownerId);
    Optional<Project> findByIdAndOwner_Id(UUID id, UUID ownerId);
}