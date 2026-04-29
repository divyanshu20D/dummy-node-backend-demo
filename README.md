# Dummy Backend Node

A small Express backend for practicing EC2 deployment, Docker, Redis, Socket.IO, and GitHub Actions CI/CD.

## What is included

- Basic REST endpoints
- Socket.IO events
- Redis connection, cache routes, and pub/sub demo
- Dockerfile and Docker Compose with Redis
- GitHub Actions workflow template for CI and EC2 deployment

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

API runs on `http://localhost:5000` by default.

## Docker setup

```bash
docker compose up --build
```

This starts:

- API: `http://localhost:5000`
- Redis: `localhost:6379`

## Endpoints

```text
GET    /
GET    /health
GET    /api/users
GET    /api/users/:id
POST   /api/users
GET    /api/messages
POST   /api/messages
GET    /api/cache/:key
POST   /api/cache
DELETE /api/cache/:key
POST   /api/events
```

Example cache request:

```bash
curl -X POST http://localhost:5000/api/cache \
  -H "Content-Type: application/json" \
  -d "{\"key\":\"deployment\",\"value\":\"ec2-demo\",\"ttl\":120}"
```

## Socket.IO events

Client emits:

```text
ping:server
chat:message
```

Server emits:

```text
ping:client
chat:message
system:event
```

## GitHub Actions deployment notes

The workflow in `.github/workflows/deploy.yml` expects these repository secrets:

```text
EC2_HOST
EC2_USER
EC2_SSH_KEY
EC2_APP_DIR
```

On your EC2 machine, install Docker and Docker Compose, clone the repo into `EC2_APP_DIR`, add a `.env` file, then push to `main`.
