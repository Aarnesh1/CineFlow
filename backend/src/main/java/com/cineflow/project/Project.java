
package com.cineflow.project;

import com.cineflow.auth.entity.AppUser;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 80)
    private String genre;

    @Column(length = 80)
    private String language;

    @Column(nullable = false, length = 30)
    private String status = "PLANNING";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Project() {}

    public Project(String title, String description, String genre,
                   String language, AppUser owner) {
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.language = language;
        this.owner = owner;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getGenre() { return genre; }
    public String getLanguage() { return language; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String title, String description,
                       String genre, String language, String status) {
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.language = language;
        this.status = status;
    }
}
