export default function DoctorDashboard({ openAgentPanel }) {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Doctor Dashboard</h1>
          <div className="helperText">Clinical summary view with referral-ready outputs.</div>
        </div>
        <div className="pageMeta">
          <span className="chip">ABDM-ready</span>
          <button className="btn btnSecondary" onClick={openAgentPanel}>
            Agent Panel
          </button>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Patient</h2>
              <p className="cardSub">Sita Devi • F/28 • Village clinic intake</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="criticalityRing" style={{ '--p': 78 }}>
              <div className="criticalityInner">
                <div className="criticalityValue">78</div>
                <div className="criticalityLabel">Criticality</div>
              </div>
            </div>
            <div className="stack" style={{ gap: 10, minWidth: 260 }}>
              <div className="fieldLabel">Risk Badges</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="chip chipWarn">Preeclampsia risk</span>
                <span className="chip chipDanger">Red flags</span>
                <span className="chip">AI confidence: High</span>
              </div>
              <div className="helperText">Summary is triage support only. Confirm with clinical evaluation.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">30-sec Summary</h2>
              <p className="cardSub">Auto-generated case narrative for rapid review.</p>
            </div>
          </div>
          <div className="helperText" style={{ color: 'var(--textSecondary)' }}>
            Patient reports headache and visual changes during pregnancy. Elevated BP suspected. Recommend urgent referral for
            evaluation and monitoring.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btnSecondary">Download PDF Referral</button>
            <button className="btn btnPrimary">Tele-consult</button>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Case Summary</h2>
              <p className="cardSub">Structured SOAP-ready notes and actions.</p>
            </div>
          </div>
          <div className="kv">
            <div className="kvRow">
              <div className="kvKey">Assessment</div>
              <div className="kvVal">High risk pattern; referral recommended. Urgent: Yes.</div>
            </div>
            <div className="kvRow">
              <div className="kvKey">Plan</div>
              <div className="kvVal">Arrange referral, monitor symptoms, ensure transport and caregiver support.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Timeline</h2>
              <p className="cardSub">Recent visits and AI flags.</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-02-10</td>
                <td>ASHA intake recorded</td>
                <td><span className="chip chipWarn">Review</span></td>
              </tr>
              <tr>
                <td>2026-01-18</td>
                <td>Prior visit noted in history</td>
                <td><span className="chip">None</span></td>
              </tr>
              <tr>
                <td>2025-11-03</td>
                <td>Diabetes record detected</td>
                <td><span className="chip chipDanger">Comorbidity</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Referral Generator</h2>
            <p className="cardSub">One-click referral draft with triage context.</p>
          </div>
        </div>
        <div className="grid2">
          <div className="helperText" style={{ color: 'var(--textSecondary)' }}>
            Referral draft includes symptoms, risk level, urgent flag, and safe actions taken. Suitable for primary-to-secondary
            facility handoff.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btnSecondary">Preview</button>
            <button className="btn btnPrimary">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  )
}
