
package com.cineflow.auth.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "character_relationships")
public class CharacterRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "source_character_id", nullable = false)
    private UUID sourceCharacterId;

    @Column(name = "target_character_id", nullable = false)
    private UUID targetCharacterId;

    @Column(name = "relationship_type", nullable = false, length = 80)
    private String relationshipType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description = "";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getSourceCharacterId() {
        return sourceCharacterId;
    }
    public void setSourceCharacterId(UUID id) {
        this.sourceCharacterId = id;
    }

    public UUID getTargetCharacterId() {
        return targetCharacterId;
    }
    public void setTargetCharacterId(UUID id) {
        this.targetCharacterId = id;
    }

    public String getRelationshipType() {
        return relationshipType;
    }
    public void setRelationshipType(String type) {
        this.relationshipType = type;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description == null ? "" : description;
    }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
