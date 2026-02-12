import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import AshaDashboard from './pages/AshaDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientProfile from './pages/PatientProfile'
import AgentMonologue from './pages/AgentMonologue'
import AdminAnalytics from './pages/AdminAnalytics'
import { Routes, Route } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(false)
  const [agentPanelOpen, setAgentPanelOpen] = useState(false)
  const [agentLogs, setAgentLogs] = useState([
    { msg: 'Agent A: Ready for multilingual intake.' },
    { msg: 'Agent B: Monitoring patient history retrieval.' },
    { msg: 'Agent C: Standing by for risk analysis.' }
  ])

  const addAgentLog = (msg) => {
    setAgentLogs((prev) => [{ msg }, ...prev].slice(0, 80))
  }

  return (
    <div className="appShell">
      <Sidebar />
      <div className="appMain">
        <div className="appContainer">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/asha"
              element={
                <AshaDashboard
                  loading={loading}
                  setLoading={setLoading}
                  addAgentLog={addAgentLog}
                  openAgentPanel={() => setAgentPanelOpen(true)}
                />
              }
            />
            <Route path="/doctor" element={<DoctorDashboard openAgentPanel={() => setAgentPanelOpen(true)} />} />
            <Route path="/patient" element={<PatientProfile />} />
            <Route
              path="/agents"
              element={<AgentMonologue logs={agentLogs} openAgentPanel={() => setAgentPanelOpen(true)} />}
            />
            <Route path="/admin" element={<AdminAnalytics />} />
          </Routes>
        </div>
      </div>
      {agentPanelOpen && <div className="agentPanelBackdrop" onClick={() => setAgentPanelOpen(false)} />}
      <aside className={`agentPanel ${agentPanelOpen ? 'agentPanelOpen' : ''}`}>
        <div className="agentPanelHeader">
          <h3 className="agentPanelTitle">Agent Monologue</h3>
          <button className="btn btnSecondary" onClick={() => setAgentPanelOpen(false)}>
            Close
          </button>
        </div>
        <div className="agentPanelBody">
          {agentLogs.map((l, i) => (
            <div key={`${l.ts}-${i}`} className="logItem">
              {l.msg}
            </div>
          ))}
        </div>
      </aside>
      {loading && (
        <div className="overlay">
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}

export default App
