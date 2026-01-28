import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './EditBlog.css'

export default function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [blog, setBlog] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const data = await api.getBlogs()
      const foundBlog = data.blogs?.find(b => b.id === parseInt(id))
      
      if (!foundBlog) {
        setError('Blog not found')
        return
      }

      // Check authorization
      if (user.id !== foundBlog.user_id && user.role !== 'admin') {
        setError('You do not have permission to edit this blog')
        return
      }

      setBlog(foundBlog)
      setFormData({
        title: foundBlog.title,
        content: foundBlog.content
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.updateBlog(id, formData)
      navigate('/blogs')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return (
    <div className="container">
      <p className="error-message">{error}</p>
      <button onClick={() => navigate('/blogs')} className="btn btn-primary">
        Back to Blogs
      </button>
    </div>
  )

  return (
    <div className="container">
      <div className="edit-blog-box">
        <h1>✏️ Edit Blog</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter blog title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Blog Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write your blog content here..."
              rows="8"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/blogs')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

