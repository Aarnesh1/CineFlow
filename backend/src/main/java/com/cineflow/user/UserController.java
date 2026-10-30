
package com.cineflow.user;

import com.cineflow.auth.dto.UpdateProfileRequest;
import com.cineflow.auth.dto.UserResponse;
import com.cineflow.auth.entity.AppUser;
import com.cineflow.auth.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AppUserRepository users;

    public UserController(AppUserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public UserResponse me(HttpServletRequest request) {
        AppUser user = getAuthenticatedUser(request);
        return toResponse(user);
    }

    @PutMapping("/me")
    public UserResponse updateMe(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest body) {

        AppUser user = getAuthenticatedUser(request);
        user.setDisplayName(body.displayName().trim());

        AppUser savedUser = users.save(user);
        return toResponse(savedUser);
    }

    private AppUser getAuthenticatedUser(HttpServletRequest request) {
        Object value = request.getAttribute("cineflow.userId");

        if (!(value instanceof UUID id)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid or missing token."
            );
        }

        return users.findById(id).orElseThrow(() ->
            new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found."
            )
        );
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(
            user.getId(),
            user.getDisplayName(),
            user.getEmail()
        );
    }
}
