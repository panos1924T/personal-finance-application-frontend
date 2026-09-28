# Personal Finance Application — Frontend

Angular frontend for the Personal Finance Application.

It provides a responsive interface for managing accounts, categories and financial transactions through the Spring Boot backend.

## Tech Stack

- Angular 21
- TypeScript
- Reactive Forms
- Angular Signals
- Angular Router
- HttpClient
- Vitest
- nginx
- Docker

## Main Features

- JWT login
- Protected routes
- Dashboard
- Account management
- Category management
- Income transactions
- Expense transactions
- Transfers
- Transaction editing and deletion
- Transaction filtering
- Pagination
- Success and error notifications
- Responsive desktop/mobile interface

---

# Local Development

## Requirements

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

The local development server uses:

```text
proxy.conf.json
```

Requests beginning with:

```text
/api
```

are proxied to:

```text
http://localhost:8080
```

Therefore the Spring Boot backend must be running locally on port `8080`.

---

# API Configuration

Frontend services use relative API paths such as:

```text
/api/v1/accounts
/api/v1/categories
/api/v1/transactions
/api/v1/auth/authenticate
```

There are no hardcoded backend hostnames in the application.

This allows the same Angular build to work with:

- localhost
- Docker
- another computer
- mobile browser
- Tailscale

## Local development

```text
Angular :4200
   |
   | /api
   v
proxy.conf.json
   |
   v
Spring Boot :8080
```

## Docker deployment

```text
Browser
   |
   v
nginx
   |
   | /api
   v
Spring Boot container
```

---

# Build

Create a production build:

```bash
npm run build
```

Output:

```text
dist/personal-finance-application-frontend/browser
```

---

# Tests

Run frontend tests:

```bash
npm test
```

The project uses Vitest through Angular's test tooling.

---

# Docker

The frontend contains:

```text
Dockerfile
nginx.conf
.dockerignore
```

The Docker image:

1. installs npm dependencies
2. builds the Angular application
3. copies the production files into nginx
4. serves the application on port `80`
5. proxies `/api` requests to the backend container

Normally the frontend should **not** be started separately.

The complete stack is controlled by the backend repository's Docker Compose configuration.

Required folder structure:

```text
projects/
├── personal-finance-application-backend/
└── personal-finance-application-frontend/
```

From the backend repository:

```bash
docker compose --env-file .env.docker up -d --build
```

The application is then available by default at:

```text
http://localhost:8081
```

---

# nginx

nginx has two responsibilities.

## Angular routing

Routes such as:

```text
/dashboard
/accounts
/categories
/transactions
```

fall back to Angular's `index.html`.

This allows browser refreshes on Angular routes.

## Backend proxy

Requests to:

```text
/api/*
```

are forwarded internally to:

```text
backend:8080
```

The browser therefore communicates only with the frontend/nginx address.

---

# Home Server / Tailscale

When the complete application runs on a home server, no frontend code changes are required.

Example server Tailscale IP:

```text
100.x.x.x
```

Open from another Tailnet device:

```text
http://100.x.x.x:8081
```

The browser loads Angular from nginx and `/api` requests are forwarded internally to Spring Boot.

No backend IP needs to be configured in Angular.

---

# Development Workflow

Typical frontend workflow:

```bash
npm install
npm start
```

Before committing:

```bash
npm test
npm run build
```

Then:

```bash
git status
git add .
git commit -m "your commit message"
git push
```

---

# Updating Docker Deployment

After frontend changes:

```bash
git pull
```

Then from the backend repository:

```bash
docker compose --env-file .env.docker up -d --build
```

Docker rebuilds the Angular application and nginx image automatically.