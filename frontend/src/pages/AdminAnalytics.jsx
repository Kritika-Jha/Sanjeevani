export default function AdminAnalytics() {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Admin & Analytics</h1>
          <div className="helperText">Program-level metrics for PHC/CHC visibility and Ministry demos.</div>
        </div>
        <div className="pageMeta">
          <span className="chip">Privacy guard: On</span>
          <span className="chip">Region: Bihar</span>
        </div>
      </div>

      <div className="grid2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card">
          <div className="fieldLabel">Total Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>1,248</div>
          <div className="helperText">Last 30 days</div>
        </div>
        <div className="card">
          <div className="fieldLabel">Red flag rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>7.3%</div>
          <div className="helperText">Urgent escalations</div>
        </div>
        <div className="card">
          <div className="fieldLabel">Avg doctor review</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>29s</div>
          <div className="helperText">Median time-to-decision</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Rural Coverage Map</h2>
            <p className="cardSub">Heatmap placeholder (SVG-based map recommended for production).</p>
          </div>
        </div>
        <div
          style={{
            height: 260,
            borderRadius: 14,
            background: 'rgba(148,163,184,.06)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--textMuted)',
            fontWeight: 750
          }}
        >
          India heatmap placeholder
        </div>
      </div>
    </div>
  )
}
