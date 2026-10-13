import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import api from './api/client'
import './App.css'

const navigation = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

const overviewStats = [
  { label: 'Open tasks', value: '18', tone: 'primary' },
  { label: 'On track', value: '72%', tone: 'success' },
  { label: 'Upcoming', value: '06', tone: 'warning' },
  { label: 'Blocked', value: '03', tone: 'danger' },
]

const projectCards = [
  { name: 'Website Refresh', owner: 'Design Team', progress: 82, due: 'Aug 22' },
  { name: 'Mobile App', owner: 'Product', progress: 64, due: 'Aug 28' },
  { name: 'Campaign Launch', owner: 'Marketing', progress: 91, due: 'Aug 18' },
]

const taskRows = [
  { title: 'Finalize homepage copy', status: 'In review', priority: 'High' },
  { title: 'Prepare sprint board', status: 'Planned', priority: 'Medium' },
  { title: 'QA release checklist', status: 'Blocked', priority: 'High' },
]

const activityFeed = [
  'Sprint planning completed for the product team.',
  '2 new comments added to the launch checklist.',
  'Project timeline updated for the QA milestone.',
]

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('taskflow-theme')
    if (savedTheme) return savedTheme

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('taskflow-theme', theme)
  }, [theme])

  useEffect(() => {
    const bootstrapAuth = async () => {
      const accessToken = localStorage.getItem('taskflow-access-token')
      if (!accessToken) {
        setUser(null)
        setAuthLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me/')
        setUser(data)
      } catch (error) {
        localStorage.removeItem('taskflow-access-token')
        localStorage.removeItem('taskflow-refresh-token')
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  const handleLogin = async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials)
    localStorage.setItem('taskflow-access-token', data.access)
    localStorage.setItem('taskflow-refresh-token', data.refresh)

    const { data: currentUser } = await api.get('/auth/me/')
    setUser(currentUser)
    navigate('/')
  }

  const handleRegister = async (payload) => {
    await api.post('/auth/register/', payload)
    await handleLogin({ username: payload.username, password: payload.password })
  }

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('taskflow-refresh-token')

    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken })
      } catch (error) {
        console.warn('Logout request failed, continuing local cleanup.', error)
      }
    }

    localStorage.removeItem('taskflow-access-token')
    localStorage.removeItem('taskflow-refresh-token')
    setUser(null)
    navigate('/login')
  }

  if (authLoading) {
    return <div className="loading-screen">Loading workspace...</div>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <AuthPage mode="login" onLogin={handleLogin} onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <AuthPage mode="register" onLogin={handleLogin} onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="*"
        element={
          user ? (
            <AuthenticatedApp user={user} onLogout={handleLogout} setTheme={setTheme} theme={theme} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

function AuthPage({ mode, onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const isRegister = mode === 'register'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await onRegister(formData)
      } else {
        await onLogin(formData)
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.message || 'Authentication failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">TF</div>
          <div>
            <p className="eyebrow">Portfolio workspace</p>
            <h1>TaskFlow</h1>
          </div>
        </div>

        <div className="auth-toggle">
          <button type="button" className={!isRegister ? 'active' : ''} onClick={() => navigate('/login')}>
            Login
          </button>
          <button type="button" className={isRegister ? 'active' : ''} onClick={() => navigate('/register')}>
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>
          )}

          <label>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AuthenticatedApp({ user, onLogout, theme, setTheme }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">TF</div>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{user.username}</h1>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="muted-label">This week</p>
          <strong>7 milestones</strong>
          <span>3 due within 48 hours</span>
          <button type="button" className="logout-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="muted-label">Overview</p>
            <h2>Operations dashboard</h2>
          </div>

          <div className="topbar-actions">
            <button type="button" className="ghost-button">
              New project
            </button>
            <button
              type="button"
              className="theme-toggle"
              aria-label="Toggle color theme"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="page-grid">
      <section className="stats-grid">
        {overviewStats.map(({ label, value, tone }) => (
          <article className={`stat-card ${tone}`} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid twin-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Project progress</h3>
            <button type="button" className="link-button">View all</button>
          </div>

          <div className="project-list">
            {projectCards.map((project) => (
              <div className="project-item" key={project.name}>
                <div className="project-meta">
                  <div>
                    <strong>{project.name}</strong>
                    <span>{project.owner}</span>
                  </div>
                  <span>{project.due}</span>
                </div>
                <div className="progress-bar" aria-label={`${project.name} progress`}>
                  <span style={{ width: `${project.progress}%` }} />
                </div>
                <small>{project.progress}% complete</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent activity</h3>
            <button type="button" className="link-button">Filter</button>
          </div>

          <ul className="activity-list">
            {activityFeed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [draft, setDraft] = useState({
    name: '',
    description: '',
    status: 'planning',
  })

  const loadProjects = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/projects/')
      const list = Array.isArray(data) ? data : data.results || []
      setProjects(list)
    } catch (err) {
      setError('Unable to load projects right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const resetDraft = () => {
    setDraft({ name: '', description: '', status: 'planning' })
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!draft.name.trim()) {
      setError('Project name is required.')
      return
    }

    try {
      if (editingId) {
        await api.patch(`/projects/${editingId}/`, draft)
      } else {
        await api.post('/projects/', draft)
      }

      resetDraft()
      await loadProjects()
    } catch (err) {
      const message = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Project save failed.'
      setError(message)
    }
  }

  const handleEdit = (project) => {
    setEditingId(project.id)
    setDraft({
      name: project.name,
      description: project.description || '',
      status: project.status,
    })
    setError('')
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await api.delete(`/projects/${deleteId}/`)
      setDeleteId(null)
      resetDraft()
      await loadProjects()
    } catch (err) {
      setError('The project could not be deleted.')
    }
  }

  return (
    <div className="project-page">
      <div className="panel project-form-panel">
        <div className="panel-header">
          <h3>{editingId ? 'Edit project' : 'Create project'}</h3>
          {editingId && (
            <button type="button" className="ghost-button" onClick={resetDraft}>
              Cancel
            </button>
          )}
        </div>

        <form className="project-form" onSubmit={handleSubmit}>
          <label>
            Project name
            <input
              name="name"
              value={draft.name}
              onChange={handleChange}
              placeholder="Launch campaign"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={draft.description}
              onChange={handleChange}
              placeholder="Brief summary of the project"
              rows="4"
            />
          </label>

          <label>
            Status
            <select name="status" value={draft.status} onChange={handleChange}>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-button">
            {editingId ? 'Save changes' : 'Create project'}
          </button>
        </form>
      </div>

      <div className="panel project-list-panel">
        <div className="panel-header">
          <h3>My projects</h3>
          <button type="button" className="ghost-button" onClick={loadProjects}>
            Refresh
          </button>
        </div>

        {loading && <div className="empty-state compact">Loading projects...</div>}

        {!loading && error && <div className="empty-state compact error-box">{error}</div>}

        {!loading && !error && projects.length === 0 && (
          <div className="empty-state compact">
            <p>No projects yet. Create your first one to begin tracking work.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="project-grid">
            {projects.map((project) => (
              <article className="mini-card" key={project.id}>
                <div className="mini-card-top">
                  <strong>{project.name}</strong>
                  <span className="pill">{project.status.replace('_', ' ')}</span>
                </div>

                <p>{project.description || 'No description yet.'}</p>

                <div className="project-meta-row">
                  <span>Updated</span>
                  <strong>{new Date(project.updated_at).toLocaleDateString()}</strong>
                </div>

                <div className="progress-bar">
                  <span style={{ width: `${project.tasks?.length ? Math.min(100, (project.tasks.length / 5) * 100) : 12}%` }} />
                </div>

                <div className="card-actions">
                  <button type="button" className="ghost-button" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button type="button" className="link-button danger" onClick={() => setDeleteId(project.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Delete this project?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="primary-button danger-button" onClick={handleDelete}>
                Delete project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TasksPage() {
  return (
    <div className="panel full-panel">
      <div className="panel-header">
        <h3>Task board</h3>
        <button type="button" className="ghost-button">Add task</button>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {taskRows.map((task) => (
            <tr key={task.title}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReportsPage() {
  return (
    <div className="panel full-panel">
      <div className="panel-header">
        <h3>Reports</h3>
      </div>
      <div className="empty-state">
        <h4>Performance insights</h4>
        <p>Charts and delivery metrics will appear here once the data layer is connected.</p>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="panel full-panel">
      <div className="panel-header">
        <h3>Settings</h3>
      </div>
      <div className="settings-list">
        <div>
          <span>Theme preference</span>
          <strong>Persisted in local storage</strong>
        </div>
        <div>
          <span>Team workspace</span>
          <strong>TaskFlow Portfolio</strong>
        </div>
      </div>
    </div>
  )
}

export default App
