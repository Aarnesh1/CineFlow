
package com.cineflow.user;

import com.cineflow.auth.dto.ChangePasswordRequest;
import com.cineflow.auth.entity.AppUser;
import com.cineflow.auth.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/me")
public class PasswordController {

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;

    public PasswordController(
            AppUserRepository users,
            PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @Valid @RequestBody ChangePasswordRequest body,
            HttpServletRequest request) {

        Object value = request.getAttribute("cineflow.userId");

        if (!(value instanceof UUID id)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid or missing token.");
        }

        AppUser user = users.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found."));

        if (!passwordEncoder.matches(
                body.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        }

        if (passwordEncoder.matches(
                body.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must differ from the current password.");
        }

        user.setPasswordHash(
                passwordEncoder.encode(body.newPassword()));
        users.save(user);
    }
}
