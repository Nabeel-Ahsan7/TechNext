# URL Shortener Application

A full-stack URL shortener application built with React and Node.js.

## Quick Start

### Option 1: Use the startup script (Recommended)

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Option 2: Using npm scripts

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Or start in production mode
npm start
```

### Option 3: Manual start

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend  
npm run dev
```

## Available Scripts

- `npm run dev` - Start both servers in development mode
- `npm run start` - Start both servers in production mode
- `npm run install:all` - Install dependencies for root, backend, and frontend
- `npm run backend:dev` - Start only backend in development mode
- `npm run frontend:dev` - Start only frontend in development mode
- `npm run build` - Build frontend for production

## Servers

- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173

## Features

- URL shortening with custom titles
- User authentication and registration
- Personal dashboard to manage URLs
- Click tracking and analytics
- Responsive design for mobile and desktop
- Copy to clipboard functionality

## Tech Stack

**Frontend:**
- React 19
- Vite
- Axios
- React Router DOM
- React Hot Toast
- Lucide React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Hashids for URL encoding

## Environment Setup

Make sure to set up your environment variables:

**Backend (.env):**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your-secret-key
BASE_URL=http://localhost:3001
HASHIDS_SALT=your-salt
```

Enjoy using the URL Shortener! 🚀