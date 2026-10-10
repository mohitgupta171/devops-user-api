
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
| GET | /health | API health check |
| GET | /users | List users |
| POST | /users | Create a user |
| GET | /users/:id | Retrieve a user |
| DELETE | /users/:id | Delete a user |

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

