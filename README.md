# CineFlow
<<<<<<< HEAD

CineFlow is a filmmaking production management platform. This repository contains the runnable Phase 1 foundation: React + Vite frontend, Spring Boot backend, PostgreSQL configuration, Flyway migration, and a premium black-and-yellow application shell.

## Stack

- Frontend: React, Vite, JavaScript, React Router, Axios, Lucide React, plain CSS
- Backend: Java 21+, Spring Boot, Maven
- Database: PostgreSQL
- Migrations: Flyway

## Prerequisites

Install:
- Node.js 20+ and npm
- Java 21+
- Maven 3.9+
- PostgreSQL 16+ (or a compatible supported PostgreSQL release)

## 1. Configure PostgreSQL

Create a database and user (adjust credentials to your local setup):

```sql
CREATE USER cineflow_user WITH PASSWORD 'change_me';
CREATE DATABASE cineflow OWNER cineflow_user;
```

## 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and update values. Spring Boot does not automatically load `.env` files; export the variables in your terminal or configure them in your IDE run configuration.

PowerShell example:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/cineflow"
$env:DB_USERNAME="cineflow_user"
$env:DB_PASSWORD="change_me"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
cd backend
mvn spring-boot:run
```

Backend URLs:
- API health: http://localhost:8080/api/v1/health
- Actuator health: http://localhost:8080/actuator/health

## 3. Run the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

The frontend reads `VITE_API_BASE_URL` from `frontend/.env`. The default is `http://localhost:8080/api/v1`.

## Environment variables

Backend:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `SERVER_PORT` (optional; defaults to 8080)

Frontend:
- `VITE_API_BASE_URL`

Do not commit real credentials or API keys.

## Current scope

Implemented in this foundation:
- Responsive CineFlow app shell and navigation
- Black-and-yellow design tokens and reusable layout styling
- Frontend API health check
- Spring Boot health endpoint and Actuator health
- PostgreSQL connection configuration
- Flyway initial schema migration
- Local setup documentation

Not implemented yet:
- Authentication and authorization
- Project CRUD and persistent project screens
- Gemini File Search integration
- Screenplay parsing, scheduling, budgets, and other production modules

These will be built in subsequent phases. The UI intentionally labels unfinished modules as planned rather than pretending they already work.


## Phase 2 — Authentication API

Added endpoints:
- `POST /api/v1/auth/register` — `{ "displayName": "Your Name", "email": "you@example.com", "password": "at-least-8-chars" }`
- `POST /api/v1/auth/login` — `{ "email": "you@example.com", "password": "your-password" }`
- `GET /api/v1/users/me` — send `Authorization: Bearer <token>`

The API stores BCrypt password hashes and returns a short-lived JWT (default 60 minutes). Set `APP_JWT_SECRET` to a private secret of at least 32 characters before running. For local testing only, the configured fallback is used if you do not set it; do not use that fallback outside local development.

For CMD, set the variables in the same terminal before `mvn spring-boot:run`:
```bat
set APP_JWT_SECRET=your-own-random-secret-of-32-or-more-characters
mvn spring-boot:run
```
=======
AI-powered film production management platform
>>>>>>> dd646d45765020d2a49317cb6e04b616927f41fd
