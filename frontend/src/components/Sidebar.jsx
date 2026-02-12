import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Bell,
  Bot,
  BarChart3,
  Settings as SettingsIcon,
  Compass
} from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebarLogo">
        <div className="sidebarBrand">Sanjeevani-Sync</div>
        <div className="sidebarSub">AI triage dashboard for last-mile care</div>
      </div>
      <div className="divider" />
      <nav className="nav">
        <NavLink to="/dashboard" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconDashboard">
            <LayoutDashboard size={14} />
          </span>
          Dashboard
        </NavLink>
        <NavLink to="/asha" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconNewCase">
            <PlusCircle size={14} />
          </span>
          New Case
        </NavLink>
        <NavLink to="/patient" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconPatients">
            <Users size={14} />
          </span>
          Patients
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconAlerts">
            <Bell size={14} />
          </span>
          Alerts
        </NavLink>
        <NavLink to="/agents" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconAgents">
            <Bot size={14} />
          </span>
          Agent Logs
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconAnalytics">
            <BarChart3 size={14} />
          </span>
          Analytics
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconSettings">
            <SettingsIcon size={14} />
          </span>
          Settings
        </NavLink>
      </nav>
      <div className="divider" />
      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}>
          <span className="navIcon iconLanding">
            <Compass size={14} />
          </span>
          Landing
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
