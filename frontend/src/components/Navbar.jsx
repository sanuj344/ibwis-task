import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📝 IBWIS
        </Link>
        <div className="navbar-menu">
          <Link to="/blogs" className="nav-link">Blogs</Link>
          {user ? (
            <>
              <span className="nav-user">👤 {user.name} ({user.role})</span>
              {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
