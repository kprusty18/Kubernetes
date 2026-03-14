
import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/api/users'

// SVG Icons as components
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  // User management state
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data)
      } else {
        setError(data.error || 'Failed to load users')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true)
      setLoginError('')
      fetchUsers()
    } else {
      setLoginError('Invalid username or password. Please try again.')
    }
  }

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
    setUsers([])
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchUsers()
        setFormData({ name: '', email: '', role: '' })
        setShowModal(false)
      } else {
        setError(data.error || 'Failed to add user')
      }
    } catch (err) {
      setError('Failed to add user')
    }
  }

  // Update - Edit user via API
  const handleEditUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${API_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        await fetchUsers()
        setEditingUser(null)
        setFormData({ name: '', email: '', role: '' })
        setShowModal(false)
      } else {
        setError(data.error || 'Failed to update user')
      }
    } catch (err) {
      setError('Failed to update user')
    }
  }

  // Delete - Remove user via API
  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setError('')
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (data.success) {
          await fetchUsers()
        } else {
          setError(data.error || 'Failed to delete user')
        }
      } catch (err) {
        setError('Failed to delete user')
      }
    }
  }

  // Open modal for add/edit
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({ name: user.name, email: user.email, role: user.role })
    } else {
      setEditingUser(null)
      setFormData({ name: '', email: '', role: '' })
    }
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', role: '' })
    setError('')
  }

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#16a34a', '#0891b2']
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="login-page">
          <div className="login-container">
            <div className="login-header">
              <div className="logo">
                <LockIcon />
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to continue to User Management</p>
            </div>
            
            {loginError && (
              <div className="error-message">
                <span>⚠️</span> {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn-login">
                Sign In
              </button>
            </form>
            
            <div className="login-footer">
              <p>Demo credentials: <code>admin</code> / <code>password</code></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main App with User Management
  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <UsersIcon />
          </div>
          <h1>User Management System</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogoutIcon />
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <div>
              <h2>Users</h2>
              <p className="subtitle">Manage your team members and their permissions</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <SearchIcon />
                <input type="text" placeholder="Search users..." />
              </div>
            </div>
            <div className="toolbar-right">
              <button onClick={() => fetchUsers()} className="btn btn-secondary">
                <RefreshIcon />
                Refresh
              </button>
              <button onClick={() => openModal()} className="btn btn-primary">
                <PlusIcon />
                Add User
              </button>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <UsersIcon />
                <h3>No users found</h3>
                <p>Get started by creating your first user</p>
                <button onClick={() => openModal()} className="btn btn-primary">
                  <PlusIcon />
                  Add User
                </button>
              </div>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar" style={{ backgroundColor: getAvatarColor(user.name) }}>
                            {getInitials(user.name)}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{user.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            onClick={() => openModal(user)} 
                            className="btn btn-edit"
                          >
                            <EditIcon />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)} 
                            className="btn btn-delete"
                          >
                            <TrashIcon />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              {error && (
                <div className="alert alert-error">
                  <span>⚠️</span> {error}
                </div>
              )}
              
              <form onSubmit={editingUser ? handleEditUser : handleAddUser}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Enter role (e.g., Admin, User, Editor)"
                    required
                  />
                </div>
                
                <div className="modal-footer" style={{ padding: 0, marginTop: '24px' }}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

