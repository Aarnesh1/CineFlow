
package com.cineflow.project;

import com.cineflow.auth.entity.AppUser;
import com.cineflow.auth.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectRepository projects;
    private final AppUserRepository users;

    public ProjectController(ProjectRepository projects,
                             AppUserRepository users) {
        this.projects = projects;
        this.users = users;
    }

    private UUID currentUserId(HttpServletRequest request) {
        Object value = request.getAttribute("cineflow.userId");
        if (!(value instanceof UUID id)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid or missing token.");
        }
        return id;
    }

    private Project ownedProject(UUID id, UUID ownerId) {
        return projects.findByIdAndOwner_Id(id, ownerId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Project not found."));
    }

    private ProjectResponse response(Project p) {
        return new ProjectResponse(
            p.getId(), p.getTitle(), p.getDescription(),
            p.getGenre(), p.getLanguage(), p.getStatus(), p.getCreatedAt()
        );
    }

    @GetMapping
    public List<ProjectResponse> list(HttpServletRequest request) {
        UUID ownerId = currentUserId(request);
        return projects.findAllByOwner_IdOrderByCreatedAtDesc(ownerId)
            .stream().map(this::response).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest body,
                                  HttpServletRequest request) {
        UUID ownerId = currentUserId(request);
        AppUser owner = users.findById(ownerId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "User not found."));

        String status = body.status() == null || body.status().isBlank()
            ? "PLANNING" : body.status().trim().toUpperCase();

        if (!List.of("PLANNING", "IN_PRODUCTION", "COMPLETED")
                .contains(status)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid project status.");
        }

        Project project = projects.save(new Project(
            body.title().trim(), body.description(), body.genre(),
            body.language(), owner
        ));

        return response(project);
    }

    @GetMapping("/{id}")
    public ProjectResponse get(@PathVariable UUID id,
                               HttpServletRequest request) {
        return response(ownedProject(id, currentUserId(request)));
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable UUID id,
                                  @Valid @RequestBody ProjectRequest body,
                                  HttpServletRequest request) {
        UUID ownerId = currentUserId(request);
        Project project = ownedProject(id, ownerId);

        String status = body.status() == null || body.status().isBlank()
            ? project.getStatus() : body.status().trim().toUpperCase();

        if (!List.of("PLANNING", "IN_PRODUCTION", "COMPLETED")
                .contains(status)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid project status.");
        }

        project.update(body.title().trim(), body.description(),
            body.genre(), body.language(), status);

        return response(projects.save(project));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id,
                       HttpServletRequest request) {
        projects.delete(ownedProject(id, currentUserId(request)));
    }
}
