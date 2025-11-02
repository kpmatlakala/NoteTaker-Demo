# Kanban Notetaker

A modern, full-stack Kanban board application for managing tasks and notes with drag-and-drop functionality.

## Features

- 🎯 Drag-and-drop cards between columns
- 📝 Create, read, update, and delete cards
- 🎨 Priority levels (Low, Medium, High)
- 🌓 Dark/light mode toggle
- 💾 Data persistence (localStorage + optional backend)
- 📤 Export/Import boards as JSON
- 🚀 RESTful API for backend integration

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Drag and Drop API
- LocalStorage for persistence

**Backend:**
- Node.js
- Express.js
- In-memory data store (easily extensible to database)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kanban-notetaker.git
cd kanban-notetaker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and configure as needed:
```
PORT=3000
NODE_ENV=development
```

### Running the Application

#### Option 1: Frontend Only (localStorage)

Simply open `frontend/index.html` in your browser. All data will be stored in localStorage.

#### Option 2: Full Stack (with Backend)

1. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

The backend will serve the frontend and provide API endpoints.

## API Documentation

### Boards

**Get all boards**
```
GET /api/boards
```

**Get a specific board**
```
GET /api/boards/:id
```

**Create a new board**
```
POST /api/boards
Body: { "name": "My Board", "columns": [...] }
```

**Update a board**
```
PUT /api/boards/:id
Body: { "name": "Updated Board", "columns": [...] }
```

**Delete a board**
```
DELETE /api/boards/:id
```

### Cards

**Get all cards in a board**
```
GET /api/boards/:boardId/cards
```

**Get a specific card**
```
GET /api/boards/:boardId/cards/:cardId
```

**Create a new card**
```
POST /api/boards/:boardId/cards
Body: { "title": "Task", "description": "Details", "priority": "medium", "columnId": "todo" }
```

**Update a card**
```
PUT /api/boards/:boardId/cards/:cardId
Body: { "title": "Updated Task", "columnId": "done" }
```

**Delete a card**
```
DELETE /api/boards/:boardId/cards/:cardId
```

## Project Structure

```
kanban-notetaker/
├── frontend/           # Client-side code
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styles and themes
│   └── app.js         # Frontend logic
├── backend/           # Server-side code
│   ├── server.js      # Express app setup
│   ├── routes/        # API route definitions
│   ├── controllers/   # Business logic
│   └── models/        # Data models
├── package.json       # Dependencies
└── README.md         # Documentation
```

## Extending the Application

### Adding Database Support

Replace the in-memory store in `backend/models/boardModel.js` with your database of choice:

- **MongoDB**: Use Mongoose
- **PostgreSQL**: Use pg or Sequelize
- **SQLite**: Use better-sqlite3

### Adding Authentication

1. Install passport.js or jsonwebtoken
2. Add authentication middleware
3. Protect routes with auth checks
4. Add user associations to boards

### Deployment

**Backend:**
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Configure CORS for production

**Frontend:**
- Deploy to Netlify, Vercel, or GitHub Pages
- Update API endpoints to production URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
```

---