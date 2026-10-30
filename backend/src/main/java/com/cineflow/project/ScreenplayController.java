
package com.cineflow.project;

import com.cineflow.auth.dto.SceneRequest;
import com.cineflow.auth.dto.SceneResponse;
import com.cineflow.auth.entity.ScreenplayScene;
import com.cineflow.auth.repository.ScreenplaySceneRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/scenes")
public class ScreenplayController {

    private final ProjectRepository projectRepository;
    private final ScreenplaySceneRepository sceneRepository;

    public ScreenplayController(
            ProjectRepository projectRepository,
            ScreenplaySceneRepository sceneRepository) {
        this.projectRepository = projectRepository;
        this.sceneRepository = sceneRepository;
    }

    // Verify that the logged-in user owns the project.
    private Project getOwnedProject(
            UUID projectId,
            HttpServletRequest request) {

        Object userIdAttribute =
                request.getAttribute("cineflow.userId");

        if (userIdAttribute == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        UUID userId;

        try {
            userId = userIdAttribute instanceof UUID
                    ? (UUID) userIdAttribute
                    : UUID.fromString(userIdAttribute.toString());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid authenticated user"
            );
        }

        return projectRepository
                .findByIdAndOwner_Id(projectId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));
    }

    // Convert entity to response DTO.
    private SceneResponse toResponse(ScreenplayScene scene) {
        return new SceneResponse(
                scene.getId(),
                scene.getProjectId(),
                scene.getSceneNumber(),
                scene.getTitle(),
                scene.getContent(),
                scene.getCreatedAt(),
                scene.getUpdatedAt()
        );
    }

    // GET: List scenes belonging to a project.
    @GetMapping
    public ResponseEntity<List<SceneResponse>> getScenes(
            @PathVariable UUID projectId,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        List<ScreenplayScene> scenes =
                sceneRepository
                        .findAllByProjectIdOrderBySceneNumberAsc(projectId);

        List<SceneResponse> responses = scenes.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    // POST: Create a new scene.
    @PostMapping
    public ResponseEntity<SceneResponse> createScene(
            @PathVariable UUID projectId,
            @Valid @RequestBody SceneRequest sceneRequest,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        List<ScreenplayScene> existingScenes =
                sceneRepository
                        .findAllByProjectIdOrderBySceneNumberAsc(projectId);

        int nextSceneNumber = existingScenes.stream()
                .mapToInt(ScreenplayScene::getSceneNumber)
                .max()
                .orElse(0) + 1;

        ScreenplayScene scene = new ScreenplayScene(
                projectId,
                nextSceneNumber,
                sceneRequest.title().trim(),
                sceneRequest.content() == null
                        ? ""
                        : sceneRequest.content()
        );

        ScreenplayScene savedScene = sceneRepository.save(scene);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(savedScene));
    }

    // PUT: Update an existing scene.
    @PutMapping("/{sceneId}")
    public ResponseEntity<SceneResponse> updateScene(
            @PathVariable UUID projectId,
            @PathVariable UUID sceneId,
            @Valid @RequestBody SceneRequest sceneRequest,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        ScreenplayScene scene = sceneRepository
                .findByIdAndProjectId(sceneId, projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Scene not found"
                ));

        scene.setTitle(sceneRequest.title().trim());
        scene.setContent(
                sceneRequest.content() == null
                        ? ""
                        : sceneRequest.content()
        );

        ScreenplayScene updatedScene = sceneRepository.save(scene);

        return ResponseEntity.ok(toResponse(updatedScene));
    }

    // DELETE: Delete a scene.
    @DeleteMapping("/{sceneId}")
    public ResponseEntity<Void> deleteScene(
            @PathVariable UUID projectId,
            @PathVariable UUID sceneId,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        ScreenplayScene scene = sceneRepository
                .findByIdAndProjectId(sceneId, projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Scene not found"
                ));

        sceneRepository.delete(scene);

        return ResponseEntity.noContent().build();
    }
}
