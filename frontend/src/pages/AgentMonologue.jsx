export default function AgentMonologue({ logs = [], openAgentPanel }) {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Agent Logs</h1>
          <div className="helperText">Real-time reasoning trail for demo, audit, and trust.</div>
        </div>
        <div className="pageMeta">
          <button className="btn btnSecondary" onClick={openAgentPanel}>
            Open Panel
          </button>
        </div>
      </div>
      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Live Feed</h2>
            <p className="cardSub">Events are intentionally descriptive and non-diagnostic.</p>
          </div>
        </div>
        <div className="stack" style={{ gap: 10 }}>
          {logs.length ? (
            logs.map((l, i) => (
              <div key={`${l.ts}-${i}`} className="logItem">
                {l.msg}
              </div>
            ))
          ) : (
            <div className="helperText">No events yet. Run a new case to populate logs.</div>
          )}
        </div>
      </div>
    </div>
  )
}
