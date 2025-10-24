# BrainMap

A simple web-based mindmap application for personal studying with multi-device sync.

## Project Structure

```
brainmap/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── utils/       # Helper functions
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/           # Flask API
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── app.py         # Flask app
│   └── requirements.txt
├── database/          # SQLite database
└── CLAUDE.md          # Project documentation
```

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run on `http://localhost:5000`

## Tech Stack

- **Frontend**: React 18, ReactFlow, Vite
- **Backend**: Python Flask, SQLAlchemy
- **Database**: SQLite
- **Target**: Desktop only

## Features

- Infinite canvas with pan and zoom
- Double-click to create nodes
- Hover to show add button
- Auto-save functionality
- Project-based organization
- Export to PNG

## Development

See `CLAUDE.md` for detailed project requirements and architecture decisions.
