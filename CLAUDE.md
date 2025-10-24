# BrainMap - Personal Mindmap Application

## Project Overview
A simple web-based mindmap application for personal studying use case with multi-device access. Built as a monolithic application using React frontend and Python Flask backend.

## Project Management
**See [KANBAN.md](./KANBAN.md) for current development status, task tracking, and sprint planning.**

## Tech Stack
- **Frontend**: React with ReactFlow library
- **Backend**: Python Flask
- **Database**: SQLite (for personal use simplicity)
- **Target Platform**: Desktop only

## Core Features

### 1. Canvas & Navigation
- Infinite canvas using ReactFlow
- Pan and zoom controls (provided by ReactFlow)
- Desktop-only interface

### 2. Project Management
- Users can organize mindmaps by project
- Each project contains one or more mindmaps

### 3. Node Creation & Editing
- **Hover interaction**: Hovering over a node displays a `+` button
- **Add leaves**: Click `+` button → textbox appears → user inputs number of leaves to create
- **Edit node text**: Double-click on node text to edit content
- **Default branching**: Creating 2 leaves by default when using double-click method
- **Parent restriction**: Do not allow branching out to parent nodes

### 4. Visual Design
- **Color coding**: Auto-assigned colors for each node
- **Branch colors**: Branches inherit the color of their source node
- Excalidraw-like floating toolbar on top (Priority: MEDIUM)

### 5. Connection Management
- **Delete branches**: Users can delete connections between nodes
- **Nice-to-have features** (defer to later):
  - Rearrange connections
  - Reconnect nodes to different parents
  - Auto-arrangement/layout algorithms

### 6. Data Persistence
- **Auto-save**: Automatically save changes to database
- **Multi-device sync**: Data stored in SQLite database accessible via Flask API
- **Export**: Export mindmap to PNG format

## Architecture Guidelines
- Monolithic structure (no microservices) for simplicity
- RESTful API endpoints for mindmap CRUD operations
- Client-side state management for real-time editing
- Server-side persistence for cross-device access

## Development Priorities
1. **HIGH**: Core node creation, editing, and branching functionality
2. **HIGH**: Auto-save and database persistence
3. **HIGH**: Project management and organization
4. **MEDIUM**: Excalidraw-like toolbar
5. **MEDIUM**: PNG export
6. **LOW**: Connection rearrangement and reconnection
7. **LOW**: Auto-layout algorithms

## User Flow
1. User selects or creates a project
2. User creates root node with double-click on canvas
3. User hovers over node to see `+` button
4. User clicks `+` to add specific number of child nodes OR double-clicks node to create 2 default leaves
5. User double-clicks node text to edit content
6. Changes auto-save to database
7. User can export final mindmap as PNG

## Code Organization
```
brainmap/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # React components (nodes, canvas, toolbar)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API calls to Flask backend
│   │   └── utils/       # Helper functions
│   └── package.json
├── backend/           # Flask application
│   ├── app.py         # Main Flask app
│   ├── models/        # Database models
│   ├── routes/        # API endpoints
│   └── requirements.txt
└── database/          # SQLite database file
```

## API Endpoints (Planned)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id/mindmaps` - Get mindmaps for a project
- `POST /api/mindmaps` - Create new mindmap
- `PUT /api/mindmaps/:id` - Update mindmap (auto-save)
- `DELETE /api/mindmaps/:id` - Delete mindmap
- `GET /api/mindmaps/:id/export` - Export mindmap as PNG

## Design Decisions
- **ReactFlow**: Chosen to align with React and provides built-in canvas, panning, zooming, and connection management
- **SQLite**: Sufficient for personal use, simpler than PostgreSQL
- **Auto-assigned colors**: Simplifies UX, colors assigned by branch for visual organization
- **Desktop-only**: Avoids mobile complexity for initial version
- **PNG export only**: Simpler than multiple format support for v1

## Notes
- Expected use case: Small to medium mindmaps for studying (not thousands of nodes)
- Multi-device access is a key requirement (justifies Flask backend)
- Keep implementation simple - this is for personal use, not production SaaS
- memory, everytime youre done with a task,  it move it to Done in KANBAN.md add next task to the Working