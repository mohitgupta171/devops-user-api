
# User Management API

A containerized REST API built with Node.js, Express, and PostgreSQL.

## Architecture

Client -> Express API -> PostgreSQL

Docker Compose runs the API and database as separate services on a
shared Docker network.

## Technology Stack

- Node.js and Express
- PostgreSQL
- Docker and Docker Compose
- Git

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
- `GET /health/live` — checks whether the API responds.
- `GET /health/ready` — checks database connectivity.
- `GET /users` — lists all users.
- `GET /users/:id` — retrieves a user by ID.
- `POST /users` — creates a user.
- `DELETE /users/:id` — deletes a user.

## Run Locally

Start the application:

    docker compose -f compose.yaml up -d --build

Check service status:

    docker compose -f compose.yaml ps

View API logs:

    docker compose -f compose.yaml logs -f api

Stop the services without deleting the database volume:

    docker compose -f compose.yaml down

## Configuration

Local development configuration is supplied through the Compose
environment section.

The .env file is excluded from Git and the Docker build context.

The database uses a named Docker volume for persistence.

## Current Scope

This project currently demonstrates basic CRUD operations, database
connectivity, containerization, service discovery, and persistent storage.

Production hardening, automated tests, CI/CD, Kubernetes deployment,
and monitoring will be added in later phases.


## Health Checks

- The API container uses Docker health checks against `/health/live`.
- PostgreSQL uses `pg_isready` to check whether the server accepts connections.
- The API readiness endpoint runs `SELECT 1` to verify database connectivity.
- Docker health status reports container health; it does not automatically restart an unhealthy container.
