
package com.cineflow.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project_characters")
public class ProjectCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "character_role", nullable = false, length = 80)
    private String characterRole = "Supporting";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description = "";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String personality = "";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String backstory = "";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ProjectCharacter() {}

    public ProjectCharacter(
            UUID projectId,
            String name,
            String characterRole,
            String description,
            String personality,
            String backstory) {
        this.projectId = projectId;
        this.name = name;
        this.characterRole = characterRole;
        this.description = description == null ? "" : description;
        this.personality = personality == null ? "" : personality;
        this.backstory = backstory == null ? "" : backstory;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public String getName() {
        return name;
    }

    public String getCharacterRole() {
        return characterRole;
    }

    public String getDescription() {
        return description;
    }

    public String getPersonality() {
        return personality;
    }

    public String getBackstory() {
        return backstory;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCharacterRole(String characterRole) {
        this.characterRole = characterRole;
    }

    public void setDescription(String description) {
        this.description = description == null ? "" : description;
    }

    public void setPersonality(String personality) {
        this.personality = personality == null ? "" : personality;
    }

    public void setBackstory(String backstory) {
        this.backstory = backstory == null ? "" : backstory;
    }
}
