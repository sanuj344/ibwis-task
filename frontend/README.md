# IBWIS Frontend - React Blog Platform

A complete React frontend for the secure blog system with role-based authentication and authorization.

## 🚀 Features

- **Authentication**: User signup and login with JWT tokens
- **Blog Management**: Create, read, update, and delete blogs
- **Role-Based Access Control**: Different permissions for users and admins
- **Responsive Design**: Works on desktop and mobile devices
- **Secure**: Stores JWT token in localStorage and attaches to API requests

## 📋 Tech Stack

- React 18
- Vite (Build tool)
- React Router DOM (Client-side routing)
- Fetch API (HTTP client)
- CSS3 (Styling)

## 📦 Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```

## 📚 Project Structure

```
frontend/src/
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # User registration
│   ├── Blogs.jsx           # Blog listing with CRUD buttons
│   ├── CreateBlog.jsx      # Create new blog
│   ├── EditBlog.jsx        # Edit blog (owner/admin)
│   └── Auth.css            # Auth pages styling
├── components/
│   ├── Navbar.jsx          # Navigation bar with logout
│   └── Navbar.css          # Navbar styling
├── services/
│   └── api.js              # API utility with fetch
├── App.jsx                 # Main app with routes
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## 🔗 Backend Connection

Backend is expected at: `http://localhost:5000`

**Note**: Update the `BASE_URL` in `src/services/api.js` if your backend runs on a different port.

## 🧭 Pages & Routes

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/login` | Login.jsx | Public | User login |
| `/signup` | Signup.jsx | Public | User registration |
| `/blogs` | Blogs.jsx | Public | View all blogs |
| `/create-blog` | CreateBlog.jsx | Authenticated | Create new blog |
| `/edit-blog/:id` | EditBlog.jsx | Owner/Admin | Edit blog |
| `/` | Redirect | Any | Redirects to /blogs |

## 🔐 Authentication Flow

### 1. Signup
- User registers with name, email, password, and role
- Data sent to POST `/signup`
- Redirects to login on success

### 2. Login
- User provides email and password
- API returns JWT token and user object
- Token and user saved to `localStorage`
- Redirected to `/blogs`

### 3. Protected Requests
- Every protected request includes `Authorization: Bearer TOKEN` header
- Token automatically attached by `api.js`
- If token invalid, server returns 401

### 4. Logout
- Clears token and user from `localStorage`
- Redirects to login page

## 📝 API Integration

All API calls go through `src/services/api.js`:

```javascript
import api from '../services/api'

// Example: Create blog
await api.createBlog({
  title: 'My Blog',
  content: 'Content here...'
})
```

**Available Methods**:
- `api.signup(userData)` - Register user
- `api.signin(credentials)` - Login user
- `api.getBlogs()` - Fetch all blogs
- `api.createBlog(blogData)` - Create blog
- `api.updateBlog(id, blogData)` - Update blog
- `api.deleteBlog(id)` - Delete blog

## 🎨 UI/UX Features

### Role-Based Visibility
- **Guest**: See blogs only
- **User**: See blogs + create blogs + edit own blogs
- **Admin**: See blogs + create blogs + edit any blogs + delete any blogs

### Navbar
- Shows current user name and role
- Admin users get a yellow ADMIN badge
- Logout button (only when logged in)

### Blog Cards
- Display blog title, author, and excerpt
- Edit button (for owner or admin)
- Delete button (for admin only)
- Date posted

### Forms
- Input validation
- Error messages displayed
- Loading states during API calls

## 🔒 Security Considerations

### Client-Side
- ✅ Stores JWT in localStorage (accessible via JS)
- ✅ Attaches token to all protected requests
- ✅ Checks user role for UI visibility

### Backend (Enforced)
- ✅ Verifies JWT on every protected request
- ✅ Checks role and ownership before allowing updates/deletes
- ✅ Returns proper HTTP status codes (401, 403)

**Note**: Frontend only controls UI visibility. **All security is enforced by backend**.

## 🧪 Testing the Frontend

### Test User Accounts
After running the backend, create test accounts:

1. **Regular User**:
   - Email: user@example.com
   - Password: password123
   - Role: user

2. **Admin User**:
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

### Test Workflow

1. **Test Public Blog Listing**:
   - Visit `/blogs` without logging in
   - Should see all blogs

2. **Test Authentication**:
   - Signup new user
   - Login with credentials
   - Token saved to localStorage

3. **Test Blog Creation**:
   - Login as user
   - Click "Create Blog"
   - Fill form and submit
   - Blog appears in list

4. **Test Blog Editing**:
   - User can edit only their blogs
   - Admin can edit any blog
   - Click "Edit" button on blog card

5. **Test Blog Deletion**:
   - Only admin can delete blogs
   - Delete button only visible to admin
   - Confirmation dialog before delete

6. **Test Logout**:
   - Click logout button
   - Redirected to login
   - Token cleared from localStorage

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Change Vite port in vite.config.js
server: {
  port: 5174  // Change this
}
```

### Backend Connection Failed
- Check backend is running on `http://localhost:5000`
- Update `BASE_URL` in `src/services/api.js`

### Token Not Persisting
- Check browser's localStorage is enabled
- Try clearing cache and reloading

### Styles Not Loading
- Clear browser cache
- Delete `dist/` folder and rebuild

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint (if configured)
```

## 🔄 Git Commits

This project follows semantic commit messages:

```
chore: initialize react project with vite and routing
feat: add login and signup pages with auth forms
feat: integrate authentication APIs and implement JWT storage
feat: display blogs from backend with role-based actions
feat: allow authenticated users to create blogs
feat: allow owner or admin to edit blogs
feat: add logout and role-based navigation with admin badge
```

## 📄 Environment Variables

Currently using hardcoded `BASE_URL`. To make it configurable:

```javascript
// .env file
VITE_API_URL=http://localhost:5000
```

Then in `api.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

## 🤝 Contributing

This frontend is designed to work with the IBWIS backend. Ensure backend API follows the specified contracts.

## 📝 License

MIT

---

**Last Updated**: January 28, 2026
