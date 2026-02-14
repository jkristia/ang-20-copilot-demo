(my notes: this entire project is created using CoPilot Claude Opus 4.5)

# Blog Posts Demo

A simple blog post application with an Angular frontend and NestJS backend, featuring real-time updates via WebSockets.

## Tech Stack

- **Frontend**: Angular 19 with Angular Material
- **Backend**: NestJS with in-memory data storage
- **Real-time**: Socket.IO for live updates across clients
- **Shared**: Common TypeScript interfaces between frontend and backend

## Features

- View, create, and manage blog posts
- Real-time updates: changes made on one client are automatically reflected on all connected clients
- Responsive Material Design UI

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm

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
make          # Show available commands
make install  # Install dependencies for both server and client
make server   # Start the NestJS backend server
make client   # Start the Angular frontend client
```

## API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /api/posts       | Get all posts        |
| GET    | /api/posts/:id   | Get a single post    |
| POST   | /api/posts       | Create a new post    |
| PUT    | /api/posts/:id   | Update a post        |
| DELETE | /api/posts/:id   | Delete a post        |

## WebSocket Events

| Event           | Direction       | Description                          |
|-----------------|-----------------|--------------------------------------|
| posts:updated   | Server → Client | Emitted when posts are modified      |

## Project Structure

```
├── client/          # Angular frontend
├── server/          # NestJS backend
├── shared/          # Shared TypeScript interfaces (@blog/shared)
├── Makefile         # Build and run commands
└── README.md
```
