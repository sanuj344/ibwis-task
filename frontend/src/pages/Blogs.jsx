import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Blogs.css'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await api.getBlogs()
      setBlogs(data.blogs || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete blogs')
      return
    }

    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      await api.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (err) {
      alert('Error deleting blog: ' + err.message)
    }
  }

  if (loading) return <div className="container"><p>Loading blogs...</p></div>
  if (error) return <div className="container error-message">{error}</div>

  return (
    <div className="container">
      <div className="blogs-header">
        <h1>📚 All Blogs</h1>
        {user && (
          <Link to="/create-blog" className="btn btn-primary">
            ✏️ Create Blog
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <p className="no-blogs">No blogs yet. {user ? 'Create one now!' : 'Login to create a blog.'}</p>
      ) : (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <article key={blog.id} className="blog-card">
              <h2>{blog.title}</h2>
              <p className="blog-author">by {blog.author_name}</p>
              <p className="blog-content">{blog.content.substring(0, 100)}...</p>
              <p className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</p>
              
              <div className="blog-actions">
                {user && (user.id === blog.user_id || user.role === 'admin') && (
                  <Link to={`/edit-blog/${blog.id}`} className="btn btn-secondary">
                    Edit
                  </Link>
                )}
                {user && user.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

