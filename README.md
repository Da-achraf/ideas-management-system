# Ideas Management – Clean Architecture Demo

A small full-stack application built with **.NET 9 (Web API)**, **Angular (TypeScript)**, and **SQL Server**, following **Clean Architecture** principles with **CQRS** and **DDD** patterns.

This project demonstrates backend and frontend integration, containerized with Docker for easy local setup.

---

## 📱 Application Preview
Screenshots of the application interface are available in the frontend/ directory root, providing a visual overview of the implemented UI/UX features and user flows.


## 🏗️ Architecture Overview

### Backend

- **Clean Architecture**

  - Domain layer is isolated (no external dependencies).
  - Application layer implements business logic via **CQRS** (Commands & Queries).
  - Infrastructure handles EF Core, persistence, and external integrations.
  - API layer provides endpoints and configures DI, middleware, and Swagger.

- **CQRS**

  - Commands → write operations (create/update/delete).
  - Queries → read operations (get by id, list).
  - Handlers implemented via **MediatR**.

- **Validation**

  - **FluentValidation** ensures request objects are validated before hitting business logic.

- **Domain Events**

  - Entities raise events (e.g., `IdeaCreatedEvent`).
  - Handlers react asynchronously inside the Application layer.

- **Persistence**
  - **EF Core 9** with SQL Server.
  - Migrations included.

---

### Frontend

- **Clean Architecture**

  - The app is **standalone** and implements **lazy loading** for all features.
  - Folder structure:
    - `core/` → core code shared between multiple features (eagerly loaded).
    - `ui/` → reusable UI components (lazy loaded).
    - `pattern/` → more complex UI components reused across features (lazy loaded).
    - `feature/` → feature modules, each with its own routes and logic.
      - If code becomes shared between features, it is moved to `ui/`, `core/`, or `pattern/` depending on its nature.
    - `layout/` → the layout of the app (header, sidebar, content, etc.).

- **State Management**

  - Implemented using **NgRx Signal Store**.
  - Used in a **dynamic way**, where components delegate everything to the Signal Store.
  - Ensures components stay lean and only handle UI concerns.
  - State, effects, and business logic are centralized in the store.

- **Styling**
  - TailwindCSS for fast and consistent design.

---

## ⚡ Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (if running frontend locally, optional)
- .NET 9 SDK (if running backend locally, optional)

---

## 🚀 Getting Started (with Docker)

You can run the application either in **development mode** or **production mode** using Docker Compose.

### 1. Clone the repository
```bash
git clone https://github.com/Da-achraf/ideas-management-system.git
cd ideas-management-system
```

### 2. Create an `.env` file at the project root
```
DB_PASSWORD=YourStrong!Passw0rd
```

### 3. Run in Development Mode
For local development, use the `docker-compose.dev.yml` file. This will build the **frontend** and **backend** from source and expose them on developer-friendly ports.

```bash
docker compose -f docker-compose.dev.yml up --build
```

* Frontend → http://localhost:8080
* Backend → http://localhost:8081/swagger
* SQL Server → `localhost,1434`

### 4. Run in Production Mode
For production, use the `docker-compose.yml` file. This expects prebuilt images (pulled or built beforehand) and exposes production-ready ports.

```bash
docker compose -f docker-compose.yml up -d
```

* Frontend → http://localhost:81
* Backend → http://localhost:8001/swagger
* SQL Server → `localhost,1434`

### 5. Building Images for Production (Optional)
If you need to build the production images locally before running the production compose file:

```bash
# Build frontend image
docker build -t ideas-management-frontend:latest ./frontend

# Build backend image  
docker build -t ideas-management-backend:latest ./backend/API

# Then run production mode
docker compose -f docker-compose.yml up -d
```