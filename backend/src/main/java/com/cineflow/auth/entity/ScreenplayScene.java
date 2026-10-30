package com.cineflow.auth.entity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "screenplay_scenes",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_project_scene_number",
        columnNames = {"project_id", "scene_number"}
    )
)
public class ScreenplayScene {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "scene_number", nullable = false)
    private Integer sceneNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content = "";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ScreenplayScene() {}

    public ScreenplayScene(
        UUID projectId,
        Integer sceneNumber,
        String title,
        String content
    ) {
        this.projectId = projectId;
        this.sceneNumber = sceneNumber;
        this.title = title;
        this.content = content == null ? "" : content;
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

    public Integer getSceneNumber() {
        return sceneNumber;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setSceneNumber(Integer sceneNumber) {
        this.sceneNumber = sceneNumber;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content == null ? "" : content;
    }
}
