
package com.cineflow.project;

import com.cineflow.auth.dto.CharacterRelationshipRequest;
import com.cineflow.auth.dto.CharacterRelationshipResponse;
import com.cineflow.auth.entity.CharacterRelationship;
import com.cineflow.auth.entity.ProjectCharacter;
import com.cineflow.auth.repository.CharacterRelationshipRepository;
import com.cineflow.auth.repository.ProjectCharacterRepository;
import com.cineflow.project.ProjectRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/relationships")
public class CharacterRelationshipController {

    private final CharacterRelationshipRepository relationshipRepository;
    private final ProjectCharacterRepository characterRepository;
    private final ProjectRepository projectRepository;

    public CharacterRelationshipController(
            CharacterRelationshipRepository relationshipRepository,
            ProjectCharacterRepository characterRepository,
            ProjectRepository projectRepository) {
        this.relationshipRepository = relationshipRepository;
        this.characterRepository = characterRepository;
        this.projectRepository = projectRepository;
    }

    private UUID requireProjectOwner(
            UUID projectId, HttpServletRequest request) {

        Object userIdAttribute = request.getAttribute("cineflow.userId");

        if (userIdAttribute == null) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        UUID userId;
        try {
            userId = UUID.fromString(userIdAttribute.toString());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid authenticated user");
        }

        boolean ownsProject = projectRepository
            .findByIdAndOwner_Id(projectId, userId)
            .isPresent();

        if (!ownsProject) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Project not found");
        }

        return userId;
    }

    private void validateCharacters(
            UUID projectId, CharacterRelationshipRequest body) {

        if (body.sourceCharacterId().equals(body.targetCharacterId())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A character cannot have a relationship with itself");
        }

        boolean sourceExists = characterRepository
            .findByIdAndProjectId(body.sourceCharacterId(), projectId)
            .isPresent();

        boolean targetExists = characterRepository
            .findByIdAndProjectId(body.targetCharacterId(), projectId)
            .isPresent();

        if (!sourceExists || !targetExists) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Both characters must belong to this project");
        }
    }

    @GetMapping
    public List<CharacterRelationshipResponse> list(
            @PathVariable UUID projectId,
            HttpServletRequest request) {

        requireProjectOwner(projectId, request);

        return relationshipRepository
            .findAllByProjectIdOrderByCreatedAtDesc(projectId)
            .stream()
            .map(CharacterRelationshipResponse::from)
            .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CharacterRelationshipResponse create(
            @PathVariable UUID projectId,
            @Valid @RequestBody CharacterRelationshipRequest body,
            HttpServletRequest request) {

        requireProjectOwner(projectId, request);
        validateCharacters(projectId, body);

        CharacterRelationship relationship =
            new CharacterRelationship();

        relationship.setProjectId(projectId);
        applyRequest(relationship, body);

        return CharacterRelationshipResponse.from(
            relationshipRepository.save(relationship));
    }

    @PutMapping("/{relationshipId}")
    public CharacterRelationshipResponse update(
            @PathVariable UUID projectId,
            @PathVariable UUID relationshipId,
            @Valid @RequestBody CharacterRelationshipRequest body,
            HttpServletRequest request) {

        requireProjectOwner(projectId, request);
        validateCharacters(projectId, body);

        CharacterRelationship relationship = relationshipRepository
            .findByIdAndProjectId(relationshipId, projectId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Relationship not found"));

        applyRequest(relationship, body);

        return CharacterRelationshipResponse.from(
            relationshipRepository.save(relationship));
    }

    @DeleteMapping("/{relationshipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID projectId,
            @PathVariable UUID relationshipId,
            HttpServletRequest request) {

        requireProjectOwner(projectId, request);

        CharacterRelationship relationship = relationshipRepository
            .findByIdAndProjectId(relationshipId, projectId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Relationship not found"));

        relationshipRepository.delete(relationship);
    }

    private void applyRequest(
            CharacterRelationship relationship,
            CharacterRelationshipRequest body) {

        relationship.setSourceCharacterId(body.sourceCharacterId());
        relationship.setTargetCharacterId(body.targetCharacterId());
        relationship.setRelationshipType(body.relationshipType().trim());
        relationship.setDescription(
            body.description() == null ? "" : body.description().trim());
    }
}
