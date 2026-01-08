# URL Shortener Backend API

A robust Node.js backend service for the URL Shortener application, providing secure user authentication and efficient URL shortening using auto-increment IDs with Hashids encoding.

## 🚀 Features

- **JWT-based Authentication** - Secure user registration and login
- **URL Shortening** - Convert long URLs to 6-8 character short codes
- **Auto-increment ID + Hashids** - Collision-free, consistent short code generation
- **Click Analytics** - Track clicks, timestamps, and usage statistics
- **Usage Limits** - Free tier with 100 URLs per user
- **PostgreSQL Database** - Reliable data persistence with Sequelize ORM
- **Soft Delete** - URLs can be safely deleted without losing analytics
- **Input Validation** - Comprehensive validation for all endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE url_shortener;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE url_shortener TO postgres;
```

### 3. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Hashids
HASHIDS_SALT=your-unique-salt-for-url-encoding
HASHIDS_MIN_LENGTH=6

# App
BASE_URL=http://localhost:3001
```

### 4. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` and automatically sync database tables.

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "urlCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### URL Management Endpoints

#### Shorten URL
```http
POST /api/urls/shorten
Authorization: Bearer <token>
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "title": "Example Website"
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL shortened successfully",
  "data": {
    "id": 1,
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortCode": "aB7kX9",
    "shortUrl": "http://localhost:3001/aB7kX9",
    "title": "Example Website",
    "clickCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User URLs (Dashboard)
```http
GET /api/urls/dashboard?page=1&limit=10&sort=createdAt&order=DESC
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "urls": [
      {
        "id": 1,
        "originalUrl": "https://www.example.com/very/long/url/path",
        "shortCode": "aB7kX9",
        "shortUrl": "http://localhost:3001/aB7kX9",
        "title": "Example Website",
        "clickCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "lastClickedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalUrls": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Delete URL
```http
DELETE /api/urls/:id
Authorization: Bearer <token>
```

### Redirect Endpoint

#### Access Short URL
```http
GET /:shortCode
```

Redirects to the original URL with 301 status and increments click count.

### Health Check
```http
GET /health
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  url_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### URLs Table
```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  title VARCHAR(200),
  click_count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── database.js         # PostgreSQL connection config
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── urlController.js    # URL management logic
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── index.js           # Models and associations
│   ├── User.js            # User model
│   └── Url.js             # URL model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── urls.js            # URL management routes
│   └── redirect.js        # Short URL redirect handling
├── utils/
│   ├── hashids.js         # Short code generation/decoding
│   └── validation.js      # Input validation utilities
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── server.js             # Express app entry point
```

## 🔧 Design Decisions

### URL Shortening Algorithm: Auto-increment ID + Hashids

**Why this approach:**
- **No collisions**: Auto-increment IDs are naturally unique
- **Consistent length**: Hashids ensures 6-8 character codes
- **Reversible**: Can decode short codes back to IDs for fast lookups
- **Obfuscated**: Salt makes IDs unpredictable
- **Fast**: No collision checking or retries needed

**How it works:**
1. Create URL record → Get auto-increment ID (e.g., 123)
2. Encode ID with Hashids → Generate short code (e.g., "aB7kX9")
3. Store short code in database
4. For redirects: Decode "aB7kX9" → 123 → Database lookup

### Security Measures

- **JWT tokens** with configurable expiration
- **Password hashing** with bcrypt (12 salt rounds)
- **Input validation** for all endpoints
- **SQL injection protection** via Sequelize ORM
- **Rate limiting ready** (can be added with middleware)

### Database Design

- **Foreign key constraints** with CASCADE delete
- **Indexes** on frequently queried fields (shortCode, userId)
- **Soft delete** pattern for URLs (isActive flag)
- **Timestamps** for all records
- **Validation** at database level

## ⚠️ Known Limitations

1. **Single server deployment** - No horizontal scaling considerations
2. **In-memory session** - JWT tokens cannot be invalidated server-side
3. **Basic rate limiting** - No sophisticated DDoS protection
4. **No URL preview** - Doesn't fetch page titles automatically
5. **PostgreSQL only** - Not database agnostic
6. **No email verification** - Users can register with any email
7. **Fixed usage limits** - No dynamic plan management

## 🚀 Performance Optimizations

- **Database indexes** on frequently queried fields
- **Connection pooling** for database connections
- **Prepared statements** via Sequelize ORM
- **Efficient pagination** with LIMIT/OFFSET
- **Transaction usage** for data consistency

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Check health endpoint
curl http://localhost:3001/health
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `NODE_ENV` | Environment | development | No |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | No |
| `DB_NAME` | Database name | url_shortener | Yes |
| `DB_USER` | Database user | postgres | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing key | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | 7d | No |
| `HASHIDS_SALT` | URL encoding salt | - | Yes |
| `HASHIDS_MIN_LENGTH` | Min short code length | 6 | No |
| `BASE_URL` | App base URL | http://localhost:3001 | Yes |

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Commit with clear messages
6. Submit a pull request

---

Built with ❤️ using Node.js, Express, and PostgreSQL