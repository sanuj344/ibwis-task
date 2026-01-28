/**
 * API utility for backend communication
 * Automatically handles JWT token from localStorage
 */

const BASE_URL = 'http://localhost:5000'

/**
 * Get JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem('token')
}

/**
 * Fetch wrapper that automatically attaches JWT token
 * @param {string} endpoint - API endpoint (e.g., '/blogs')
 * @param {object} options - fetch options
 */
async function apiCall(endpoint, options = {}) {
  const token = getToken()
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Attach JWT token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}

// Export API functions
export const api = {
  // Auth endpoints
  signup: (userData) => 
    apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  signin: (credentials) =>
    apiCall('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  // Blog endpoints
  getBlogs: () =>
    apiCall('/blogs', { method: 'GET' }),

  createBlog: (blogData) =>
    apiCall('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    }),

  updateBlog: (id, blogData) =>
    apiCall(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    }),

  deleteBlog: (id) =>
    apiCall(`/blogs/${id}`, {
      method: 'DELETE'
    })
}

export default api
