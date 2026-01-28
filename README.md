# IBWIS - Secure Role-Based Authentication & Authorization System

A production-ready backend API built with Node.js, Express, SQLite, and JWT for secure authentication and role-based access control (RBAC).

## 🔐 Features

- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Role-Based Access Control (RBAC)**: User and Admin roles with granular permissions
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Authorization Enforcement**: Role and ownership checks strictly enforced on backend
- **SQLite Database**: Lightweight, file-based database with foreign key constraints
- **Input Validation**: Comprehensive input validation to prevent injection attacks
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Security Headers**: Express security best practices implemented

## 🛠️ Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express.js 4.x
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

## 📋 Prerequisites

- Node.js 22+ installed
- npm or yarn package manager

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/sanuj344/ibwis-task.git
cd ibwis-task
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
# .env file (already created with defaults)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=7d
PORT=5000
NODE_ENV=development
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` in production!

### 4. Start the server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes

#### 1. Signup (Register User)
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

**Responses**:
- `201 Created`: User registered successfully
- `400 Bad Request`: Validation error
- `409 Conflict`: Email already registered

**Example Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

#### 2. Signin (Login)
```http
POST /signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses**:
- `200 OK`: Authentication successful, returns JWT token
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Missing required fields

**Example Response**:
```json
{
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### Blog Routes

All blog routes (except GET) require authentication via JWT token in the `Authorization` header.

#### Authorization Header Format
```http
Authorization: Bearer <your_jwt_token>
```

#### 1. Get All Blogs (Public)
```http
GET /blogs
```

**Responses**:
- `200 OK`: Returns list of all blogs

**Example Response**:
```json
{
  "message": "Blogs retrieved successfully",
  "count": 2,
  "blogs": [
    {
      "id": 1,
      "title": "My First Blog",
      "content": "Blog content here...",
      "user_id": 1,
      "author_name": "John Doe",
      "author_email": "john@example.com",
      "created_at": "2026-01-28T10:00:00Z",
      "updated_at": "2026-01-28T10:30:00Z"
    }
  ]
}
```

---

#### 2. Create Blog (Authenticated - User & Admin)
```http
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Blog",
  "content": "This is the blog content..."
}
```

**Responses**:
- `201 Created`: Blog created successfully
- `400 Bad Request`: Missing title or content
- `401 Unauthorized`: Invalid or missing token

**Security Note**: The `user_id` is extracted from the JWT token, never from the request body.

---

#### 3. Update Blog (Authenticated - Owner or Admin)
```http
PUT /blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Responses**:
- `200 OK`: Blog updated successfully
- `403 Forbidden`: Not authorized (not owner or admin)
- `404 Not Found`: Blog doesn't exist
- `401 Unauthorized`: Invalid or missing token

**Authorization Logic**:
- Blog owner (user who created it) can update their own blogs
- Admin users can update any blog

---

#### 4. Delete Blog (Authenticated - Admin Only)
```http
DELETE /blogs/:id
Authorization: Bearer <token>
```

**Responses**:
- `200 OK`: Blog deleted successfully
- `403 Forbidden`: Only admins can delete blogs
- `404 Not Found`: Blog doesn't exist
- `401 Unauthorized`: Invalid or missing token

---

## 🔒 Security Features

### 1. Password Hashing
- Passwords are hashed using bcrypt with 10 salt rounds
- Original passwords never stored in database
- Passwords compared using secure bcrypt algorithm

### 2. JWT Authentication
- Tokens signed with secret key
- Tokens contain user `id`, `email`, `role`, and `name`
- Configurable token expiration (default: 7 days)
- Token verified on every protected request

### 3. Authorization Enforcement
- Role and ownership checks **strictly enforced on backend**
- User info extracted **only from JWT token**, never trusting client input
- `user_id` and `role` cannot be overridden by request body
- Returns `403 Forbidden` for unauthorized access

### 4. Input Validation
- Email format validation
- Password minimum length enforcement (6 characters)
- String length limits on inputs
- Type checking for all inputs

### 5. User Enumeration Prevention
- Login endpoint returns generic error message ("Invalid email or password")
- Cannot determine if email exists through login attempts

### 6. Additional Protections
- Request body size limit (10KB)
- Express security headers configured
- Proper HTTP status codes used
- Foreign key constraints in database

## 📁 Project Structure

```
ibwis-task/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── blogController.js      # Blog CRUD operations
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── blogRoutes.js          # Blog endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorHandler.js        # Error handling
│   ├── db/
│   │   ├── database.js            # SQLite connection
│   │   └── init.js                # Schema initialization
│   └── utils/
│       └── validation.js          # Input validation helpers
├── data/
│   └── ibwis.db                   # SQLite database file
├── server.js                      # Express app setup
├── package.json                   # Dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Blogs Table
```sql
CREATE TABLE blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🧪 Testing Examples

### 1. Register a User
```bash
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

### 2. Login (Get Token)
```bash
curl -X POST http://localhost:5000/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

### 3. Create a Blog (with token)
```bash
curl -X POST http://localhost:5000/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post!"
  }'
```

### 4. Get All Blogs
```bash
curl http://localhost:5000/blogs
```

### 5. Update a Blog
```bash
curl -X PUT http://localhost:5000/blogs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content..."
  }'
```

### 6. Delete a Blog (Admin Only)
```bash
curl -X DELETE http://localhost:5000/blogs/1 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 🔑 Key Security Rules

1. ✅ **Never trust client input for authorization**
   - User ID extracted from JWT token
   - Role extracted from JWT token
   - Blog ownership verified against JWT token

2. ✅ **Password security**
   - Minimum 6 characters
   - bcrypt hashing with 10 salt rounds
   - Original never stored

3. ✅ **HTTP status codes**
   - `401 Unauthorized`: Missing/invalid token
   - `403 Forbidden`: Authenticated but not authorized
   - `404 Not Found`: Resource doesn't exist
   - `409 Conflict`: Email already exists

4. ✅ **Database security**
   - Foreign key constraints enabled
   - Parameterized queries (SQL injection prevention)
   - Email unique constraint

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use a proper database (consider PostgreSQL)
- [ ] Enable HTTPS/TLS
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Use environment-specific `.env` files
- [ ] Set up database backups
- [ ] Implement refresh token rotation
- [ ] Add request validation schemas (joi/yup)
- [ ] Enable CORS if needed with proper origins

## 📝 Git Commit History

This project follows clean Git practices with meaningful commits:

```
1. chore: initialize express server and sqlite database
2. feat: add users and blogs database schema
3. feat: implement secure signup with password hashing
4. feat: implement signin with JWT authentication
5. feat: add authentication middleware for protected routes
6. feat: add public blog listing endpoint
7. feat: allow authenticated users to create blogs
8. feat: restrict blog update to owner or admin
9. feat: restrict blog deletion to admin role only
10. chore: improve security and error handling
11. docs: add README and project documentation
```

## 🤝 Contributing

This is an educational project. Feel free to fork and extend it!

## 📄 License

MIT

## 👨‍💻 Author

Built as a secure authentication & authorization reference implementation.

---

**Last Updated**: January 28, 2026
