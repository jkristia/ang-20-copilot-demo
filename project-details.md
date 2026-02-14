# Project Details

## API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /api/posts       | Get all posts        |
| GET    | /api/posts/:id   | Get a single post    |
| POST   | /api/posts       | Create a new post    |
| PUT    | /api/posts/:id   | Update a post        |
| DELETE | /api/posts/:id   | Delete a post        |

## WebSocket Events

### Posts Events

| Event           | Direction       | Description                          |
|-----------------|-----------------|--------------------------------------|
| posts:updated   | Server → Client | Emitted when posts are modified      |

### Config Events

| Event           | Direction       | Description                                    |
|-----------------|-----------------|------------------------------------------------|
| config:get      | Client → Server | Request current configuration                  |
| config:update   | Client → Server | Send configuration changes                     |
| config:current  | Server → Client | Sends current config (on connect or request)   |
| config:updated  | Server → Client | Broadcasts config changes to all clients       |

## Demo Config Page

The Demo Config page (`/config`) demonstrates real-time configuration synchronization across multiple clients using WebSockets.

### How It Works

1. **Initial Connection**: When a client connects, the server immediately sends the current configuration state
2. **Making Changes**: When a user modifies any setting (toggle, input field, dropdown), the change is emitted to the server via WebSocket
3. **Broadcasting Updates**: The server updates the configuration and broadcasts the new state to ALL connected clients
4. **Real-time Sync**: All browser windows/tabs instantly reflect the updated configuration without page refresh

### Configuration Options

| Option       | Type     | Description                              |
|--------------|----------|------------------------------------------|
| enabled      | boolean  | Toggle switch for enabling/disabling     |
| float_value  | number   | Decimal number input                     |
| int_value    | integer  | Whole number input                       |
| string_value | string   | Free text input                          |
| select_value | enum     | Dropdown selection                       |

### Testing Real-time Updates

1. Open the app in two or more browser windows
2. Navigate to `/config` in each window
3. Change any configuration value in one window
4. Observe the change instantly appearing in all other windows

## Project Structure

```
├── client/          # Angular frontend
├── server/          # NestJS backend
├── shared/          # Shared TypeScript interfaces (@blog/shared)
├── Makefile         # Build and run commands
└── README.md
```
