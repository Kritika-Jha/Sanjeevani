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
        <div className="card cardAccentPurple">
          <div className="fieldLabel">Total Cases</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>1,248</div>
          <div className="helperText">Last 30 days</div>
        </div>
        <div className="card cardAccentRose">
          <div className="fieldLabel">Red flag rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>7.3%</div>
          <div className="helperText">Urgent escalations</div>
        </div>
        <div className="card cardAccentCyan">
          <div className="fieldLabel">Avg doctor review</div>
          <div style={{ fontSize: '2rem', fontWeight: 850, marginTop: 10 }}>29s</div>
          <div className="helperText">Median time-to-decision</div>
        </div>
      </div>

      <div className="card cardAccentCyan">
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
            background: 'linear-gradient(180deg, rgba(6,182,212,.12), rgba(148,163,184,.06))',
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

      <div className="grid2">
        <div className="card cardAccentPurple">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Trends</h2>
              <p className="cardSub">Monthly movement (placeholder).</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
            <div style={{ width: 18, height: 38, background: 'rgba(124,58,237,.30)', borderRadius: 6 }} />
            <div style={{ width: 18, height: 62, background: 'rgba(6,182,212,.30)', borderRadius: 6 }} />
            <div style={{ width: 18, height: 48, background: 'rgba(251,113,133,.28)', borderRadius: 6 }} />
            <div style={{ width: 18, height: 72, background: 'rgba(124,58,237,.30)', borderRadius: 6 }} />
            <div style={{ width: 18, height: 56, background: 'rgba(6,182,212,.30)', borderRadius: 6 }} />
          </div>
        </div>
        <div className="card cardAccentRose">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Queues</h2>
              <p className="cardSub">Operational backlog indicators.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="chip chipDanger">Urgent referrals: 3</span>
            <span className="chip chipWarn">Pending reviews: 11</span>
            <span className="chip chipOk">Completed: 148</span>
          </div>
        </div>
      </div>
    </div>
  )
}
