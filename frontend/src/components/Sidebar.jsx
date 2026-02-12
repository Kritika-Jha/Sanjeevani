import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebarLogo">
        <div className="sidebarBrand">Sanjeevani-Sync</div>
        <div className="sidebarSub">AI triage dashboard for last-mile care</div>
      </div>
      <div className="divider" />
      <nav className="nav">
        <NavLink to="/asha" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">D</span>
          Dashboard
        </NavLink>
        <NavLink to="/asha" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">+</span>
          New Case
        </NavLink>
        <NavLink to="/patient" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">P</span>
          Patients
        </NavLink>
        <NavLink to="/asha" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">!</span>
          Alerts
        </NavLink>
        <NavLink to="/agents" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">A</span>
          Agent Logs
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">📈</span>
          Analytics
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">⚙</span>
          Settings
        </NavLink>
      </nav>
      <div className="divider" />
      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">⎋</span>
          Landing
        </NavLink>
        <NavLink to="/doctor" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon">MD</span>
          Doctor View
        </NavLink>
      </nav>
      <div className="sidebarFooter">
        <div className="statusPill">
          <span className="dot" />
          Agents Active
        </div>
      </div>
    </aside>
  )
}
