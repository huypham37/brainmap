# BrainMap Project Kanban

## 🎯 Todo

### Core Features

### Export & Persistence
- [ ] Implement export to PNG functionality

### UI/UX Enhancements
- [ ] Add Excalidraw-like floating toolbar
- [ ] Add toolbar buttons (Reset View, Export PNG, etc.)
- [ ] Improve node styling and visual design
- [ ] Add keyboard shortcuts (Delete, Undo, etc.)

### Nice-to-Have (Future)
- [ ] Rearrange connections between nodes
- [ ] Reconnect nodes to different parents
- [ ] Auto-arrangement/layout algorithms
- [ ] Node search functionality
- [ ] Mini-map for navigation

---

## 🚧 In Progress

---

## ✅ Done

### Setup & Infrastructure
- [x] Project structure created
- [x] Frontend dependencies installed
- [x] Backend dependencies installed
- [x] Flask server running on port 5001
- [x] Vite dev server running on port 3000
- [x] Database models created
- [x] API endpoints implemented
- [x] Configure Vite proxy to Flask backend
- [x] Fix port conflict (5000 → 5001)
- [x] Test health check endpoint
- [x] Verify ReactFlow canvas renders

### Core Features - Completed
- [x] Complete node creation logic (double-click on canvas)
- [x] Add color assignment logic (auto-assign colors)
- [x] Apply colors to node borders and + buttons
- [x] Implement + button functionality to create multiple child nodes
  - [x] Show input dialog when + button clicked
  - [x] Create specified number of child nodes
  - [x] Create edges with matching colors
  - [x] Position child nodes horizontally below parent
- [x] Implement node text editing (double-click text)
  - [x] Use useReactFlow to update node data
  - [x] Support Enter key to save, Escape to cancel
  - [x] Update node label in ReactFlow state
- [x] Add color assignment logic (auto-assign by branch)
  - [x] Root nodes get unique colors from palette
  - [x] Child nodes inherit parent's color
- [x] Implement branch/edge color inheritance from source node
  - [x] Edges use parent node color for stroke
- [x] Implement horizontal right tree layout
  - [x] Children appear to the right of parent
  - [x] Children stack vertically with proper spacing
  - [x] Centered vertically around parent
- [x] Add delete branch functionality
  - [x] Click edge to select it
  - [x] Press Delete key to remove edge
  - [x] Also works for deleting nodes
- [x] Add visual selection indicators
  - [x] Selected nodes have light blue background
  - [x] Selected nodes have thicker border and glow effect
  - [x] Smooth transition animations
- [x] Implement basic save/load functionality
  - [x] Save button saves to database
  - [x] Load button retrieves from database
  - [x] Default project auto-created
  - [x] Status indicators for save/load operations
- [x] Implement auto-save to backend (debounced)
  - [x] Auto-saves 2 seconds after changes stop
  - [x] Only auto-saves after first manual save
  - [x] Shows "Auto-saving..." status
  - [x] Prevents data loss

### Project Management - Completed
- [x] Create project selection/creation UI
  - [x] ProjectSwitcher component with dropdown
  - [x] Shows current project in button
  - [x] Lists all projects with creation dates
- [x] Add project switcher component
  - [x] Integrated into MindMapCanvas
  - [x] Positioned at top-left
- [x] Integrate project API with frontend
  - [x] Load projects on mount
  - [x] Create new projects
  - [x] Switch between projects
- [x] Add mindmap creation within projects
  - [x] New button to create blank mindmap
  - [x] Auto-load first mindmap when switching projects
  - [x] Clear canvas when creating new mindmap

---

## 📝 Notes

### Current Sprint Focus
**Sprint 2: Project Management & Export** ✅ (Project Management Complete!)
- ✅ Build project management UI
- ✅ Complete save/load functionality
- 🚧 Implement PNG export

### Next Sprint
**Sprint 3: UI/UX Enhancements**
- Add Excalidraw-like floating toolbar
- Implement PNG export
- Add keyboard shortcuts
- Improve node styling

### Technical Debt
- Need to handle SQLite database file creation
- Add error handling for API calls
- Add loading states in UI
- Consider adding unit tests

### Decisions & Blockers
- ✅ Port 5000 conflict resolved (moved to 5001)
- ✅ SQLAlchemy version updated for Python 3.13 compatibility
