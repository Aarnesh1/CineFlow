
package com.cineflow.project;

import com.cineflow.auth.dto.CharacterRequest;
import com.cineflow.auth.dto.CharacterResponse;
import com.cineflow.auth.entity.ProjectCharacter;
import com.cineflow.auth.repository.ProjectCharacterRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/characters")
public class CharacterController {

    private final ProjectRepository projectRepository;
    private final ProjectCharacterRepository characterRepository;

    public CharacterController(
            ProjectRepository projectRepository,
            ProjectCharacterRepository characterRepository) {
        this.projectRepository = projectRepository;
        this.characterRepository = characterRepository;
    }

    private Project getOwnedProject(
            UUID projectId,
            HttpServletRequest request) {

        Object userIdAttribute = request.getAttribute("cineflow.userId");

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

    private CharacterResponse toResponse(ProjectCharacter character) {
        return CharacterResponse.from(character);
    }

    private String normalizeOptionalText(String value) {
        return value == null ? "" : value.trim();
    }

    @GetMapping
    public ResponseEntity<List<CharacterResponse>> getCharacters(
            @PathVariable UUID projectId,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        List<CharacterResponse> characters = characterRepository
                .findAllByProjectIdOrderByNameAsc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(characters);
    }

    @PostMapping
    public ResponseEntity<CharacterResponse> createCharacter(
            @PathVariable UUID projectId,
            @Valid @RequestBody CharacterRequest characterRequest,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        ProjectCharacter character = new ProjectCharacter(
                projectId,
                characterRequest.name().trim(),
                characterRequest.characterRole().trim(),
                normalizeOptionalText(characterRequest.description()),
                normalizeOptionalText(characterRequest.personality()),
                normalizeOptionalText(characterRequest.backstory())
        );

        ProjectCharacter savedCharacter =
                characterRepository.save(character);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(savedCharacter));
    }

    @PutMapping("/{characterId}")
    public ResponseEntity<CharacterResponse> updateCharacter(
            @PathVariable UUID projectId,
            @PathVariable UUID characterId,
            @Valid @RequestBody CharacterRequest characterRequest,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        ProjectCharacter character = characterRepository
                .findByIdAndProjectId(characterId, projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Character not found"
                ));

        character.setName(characterRequest.name().trim());
        character.setCharacterRole(
                characterRequest.characterRole().trim()
        );
        character.setDescription(
                normalizeOptionalText(characterRequest.description())
        );
        character.setPersonality(
                normalizeOptionalText(characterRequest.personality())
        );
        character.setBackstory(
                normalizeOptionalText(characterRequest.backstory())
        );

        ProjectCharacter updatedCharacter =
                characterRepository.save(character);

        return ResponseEntity.ok(toResponse(updatedCharacter));
    }

    @DeleteMapping("/{characterId}")
    public ResponseEntity<Void> deleteCharacter(
            @PathVariable UUID projectId,
            @PathVariable UUID characterId,
            HttpServletRequest request) {

        getOwnedProject(projectId, request);

        ProjectCharacter character = characterRepository
                .findByIdAndProjectId(characterId, projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Character not found"
                ));

        characterRepository.delete(character);

        return ResponseEntity.noContent().build();
    }
}
    