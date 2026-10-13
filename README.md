# User Management API

A hands-on DevOps project that runs a Node.js REST API with PostgreSQL using Docker and Docker Compose. The repository also contains Kubernetes manifests for practicing container orchestration and deployment.

## Project Overview

The API provides basic user-management operations and health-check endpoints. The project is intended for learning how applications are containerized, configured, connected to databases, and deployed in container-based environments.

## Technology Stack

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **PostgreSQL** — Relational database
- **Docker** — Application containerization
- **Docker Compose** — Local multi-container orchestration
- **Kubernetes** — Container orchestration lab
- **Git and GitHub** — Version control and collaboration

## Architecture

The application uses a simple three-component architecture:

```text
Client
  |
  v
Node.js / Express API
  |
  v
PostgreSQL Database
```

Docker Compose runs the API and database as separate services on a shared Docker network. The API connects to PostgreSQL using the database service's network name.

PostgreSQL data is stored in a named Docker volume so that it can survive ordinary container recreation.

## Project Structure

```text
.
├── src/
│   ├── db.js
│   └── server.js
├── k8s-api-deployment.yaml
├── k8s-api-service.yaml
├── k8s-db-deployment.yaml
├── k8s-db-pvc.yaml
├── k8s-db-service.yaml
├── kind-config.yaml
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Install the following tools:

- Git
- Docker Engine
- Docker Compose v2

Verify the installations:

```bash
git --version
docker --version
docker compose version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mohitgupta171/devops-user-api.git
cd devops-user-api
```

### 2. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Review `.env` and adjust the values if necessary.

**Important:** `.env` may contain local credentials and is excluded from Git. Never commit real passwords or secrets. `.env.example` provides a safe template for other developers.

### 3. Build and start the application

```bash
docker compose -f compose.yaml up -d --build
```

This command builds the API image if needed and starts the API and PostgreSQL services in the background.

### 4. Check service status

```bash
docker compose -f compose.yaml ps
```

View API logs:

```bash
docker compose -f compose.yaml logs -f api
```

View database logs:

```bash
docker compose -f compose.yaml logs -f db
```

The service names above assume the Compose services are named `api` and `db`.

## API Endpoints

The API is expected to be available at `http://localhost:3000` when the configured host port is 3000.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health/live` | Checks whether the API is running and responding |
| GET | `/health/ready` | Checks database connectivity and readiness |
| GET | `/users` | Retrieves a list of users |
| GET | `/users/:id` | Retrieves a user by ID |
| POST | `/users` | Creates a user |
| DELETE | `/users/:id` | Deletes a user by ID |

### Example requests

Check API liveness:

```bash
curl -i http://localhost:3000/health/live
```

Check database readiness:

```bash
curl -i http://localhost:3000/health/ready
```

Retrieve users:

```bash
curl -i http://localhost:3000/users
```

Retrieve a specific user:

```bash
curl -i http://localhost:3000/users/1
```

Create a user:

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

Delete a user:

```bash
curl -i -X DELETE http://localhost:3000/users/1
```

The create-user request assumes the API accepts `name` and `email` fields. Adjust the example to match the actual request validation and database schema.

## Environment Variables

The `.env.example` file documents the environment variables used by the application.

| Variable | Purpose |
|---|---|
| `PORT` | Port on which the API listens |
| `DB_HOST` | Database hostname |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |

When the API runs inside Docker Compose, it must use the database service name as its hostname rather than `localhost`. The actual container configuration is defined in `compose.yaml`.

## Health Checks

The application and database have separate health checks:

- **API liveness:** `/health/live` checks whether the API responds.
- **API readiness:** `/health/ready` verifies database connectivity.
- **PostgreSQL health:** `pg_isready` checks whether PostgreSQL is accepting connections.

Docker health status helps identify unhealthy containers, but an unhealthy status does not automatically restart a container.

## Database Persistence

PostgreSQL stores its data in a named Docker volume configured in `compose.yaml`.

Stop and remove the Compose containers and network:

```bash
docker compose -f compose.yaml down
```

Ordinarily, this preserves the named database volume.

**Warning:** Removing the database volume deletes the data stored in it. Do not remove volumes unless you intentionally want to reset the database.

## Troubleshooting

### API cannot connect to PostgreSQL

- Check service status with `docker compose -f compose.yaml ps`.
- Inspect the API and database logs.
- Verify the database hostname, credentials, and port configuration.
- Confirm PostgreSQL has passed its health check.

### Port already in use

Another process may be using the configured host port. Identify the conflicting process or change the host-side port mapping in `compose.yaml`.

### API container exits

Inspect the API logs and check for startup errors, missing environment variables, or database connection failures.

### Changes are not reflected in the container

Rebuild and recreate the services when the Docker image needs updating:

```bash
docker compose -f compose.yaml up -d --build
```

## Kubernetes Lab

The repository includes Kubernetes manifests for practicing deployment of the API and database:

- `k8s-api-deployment.yaml` — API Deployment
- `k8s-api-service.yaml` — API Service
- `k8s-db-deployment.yaml` — PostgreSQL Deployment
- `k8s-db-service.yaml` — PostgreSQL Service
- `k8s-db-pvc.yaml` — PersistentVolumeClaim for database storage
- `kind-config.yaml` — Kind cluster configuration

These files are intended for a separate Kubernetes lab. A running Kubernetes cluster is not required for the Docker Compose setup described above.

## Learning Objectives

This project provides practical experience with:

- Building and running a containerized API
- Connecting application and database services
- Managing environment-specific configuration
- Using Docker Compose for local development
- Working with health checks and persistent storage
- Deploying workloads using Kubernetes manifests
- Managing application changes with Git and GitHub
