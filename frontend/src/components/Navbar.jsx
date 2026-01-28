import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

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
              <span className="nav-user">{user.name} ({user.role})</span>
              <Link to="/login" className="nav-link">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
