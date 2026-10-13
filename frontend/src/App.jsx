import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('taskflow-theme')
    if (savedTheme) return savedTheme

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('taskflow-theme', theme)
  }, [theme])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">TF</div>
          <div>
            <p className="eyebrow">Portfolio project</p>
            <h1>TaskFlow</h1>
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
  return (
    <div className="panel full-panel">
      <div className="panel-header">
        <h3>Projects</h3>
        <button type="button" className="ghost-button">Create project</button>
      </div>

      <div className="card-grid">
        {projectCards.map((project) => (
          <article className="mini-card" key={project.name}>
            <div className="mini-card-top">
              <strong>{project.name}</strong>
              <span className="pill">{project.due}</span>
            </div>
            <p>{project.owner}</p>
            <div className="progress-bar" aria-label={`${project.name} progress`}>
              <span style={{ width: `${project.progress}%` }} />
            </div>
            <small>{project.progress}% complete</small>
          </article>
        ))}
      </div>
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
