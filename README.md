(my notes: this entire project is created using CoPilot Claude Opus 4.5)

# Blog Posts Demo

A simple blog post application with an Angular frontend and NestJS backend, featuring real-time updates via WebSockets.

## Tech Stack

- **Frontend**: Angular 20 with Angular Material and AG Grid
- **Backend**: NestJS with in-memory data storage
- **Real-time**: Socket.IO for live updates across clients
- **Data Grid**: AG Grid Community with virtual scrolling
- **Shared**: Common TypeScript interfaces between frontend and backend

## Features

- View, create, and manage blog posts
- Real-time updates: changes made on one client are automatically reflected on all connected clients
- **Demo Config Page**: Real-time synchronized configuration across all clients
- **Employees Table**: AG Grid with virtual scrolling for 1000+ records
- **Tabbed Employee Views**: Employees list and Employee Details on separate tabs at `/employees`
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

See [project-details.md](project-details.md) for API endpoints, WebSocket events, and detailed documentation.
