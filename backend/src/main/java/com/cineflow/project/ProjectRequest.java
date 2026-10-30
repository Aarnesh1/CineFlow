package com.cineflow.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectRequest(
    @NotBlank @Size(max = 150) String title,
    @Size(max = 2000) String description,
    @Size(max = 80) String genre,
    @Size(max = 80) String language,
    @Size(max = 30) String status
) {}