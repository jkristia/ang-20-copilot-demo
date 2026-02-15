(my notes: this entire project is created using CoPilot Claude Opus 4.5)

# Blog Posts Demo

A simple blog post application with an Angular frontend and NestJS backend, featuring REST APIs for data operations and real-time update notifications via WebSockets.

## Tech Stack

- **Frontend**: Angular 20 with Angular Material and AG Grid
- **Backend**: NestJS with in-memory data storage
- **Real-time**: Socket.IO for live update notifications across clients
- **Data Grid**: AG Grid Community with virtual scrolling
- **Shared**: Common TypeScript interfaces between frontend and backend

## Features

- View, create, and manage blog posts
- Real-time updates: changes made on one client are automatically reflected on all connected clients
- **Demo Config Page**: REST-managed configuration with real-time sync via WebSocket updates
- **Employees Table**: AG Grid with virtual scrolling for 1000+ records
- **Tabbed Employee Views**: Employees list and Employee Details on separate tabs at `/employees`
- **Editable Employee Details**: Inline cell editing with validation, persisted to CSV, synced via WebSocket
- Responsive Material Design UI

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm
- Python 3.9+ (for mock data generation)

## Getting Started

### Install dependencies

```bash
make install
```

### Run the application

Start the backend server (runs on http://localhost:3000):

```bash
make server
```

Start the frontend client in a separate terminal (runs on http://localhost:4200):

```bash
make client
```

## Available Commands

```bash
make               # Show available commands
make install       # Install dependencies for both server and client
make server        # Start the NestJS backend server (auto-generates mock data if missing)
make client        # Start the Angular frontend client
make generate-data # Regenerate all mock data files
```

## Swagger / OpenAPI

Swagger UI is available at http://localhost:3000/openapi when the server is running. An OpenAPI YAML file is also generated at [server/openapi.yaml](server/openapi.yaml), which you can inspect with Swagger Editor (https://editor.swagger.io) by importing the file. Note: OpenAPI schemas are generated from Swagger-decorated DTO classes; shared TypeScript interfaces are not reflected in the spec.

See [project-details.md](project-details.md) for API endpoints, WebSocket events, and detailed documentation.
