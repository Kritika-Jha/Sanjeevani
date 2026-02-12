import { useMemo, useState } from 'react'

export default function PatientProfile() {
  const tabs = useMemo(() => ['Overview', 'History', 'Medications', 'Risk Analysis', 'Reports'], [])
  const [tab, setTab] = useState(tabs[0])

  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Patient Profile</h1>
          <div className="helperText">Unified longitudinal view: intake, retrieval context, and risk flags.</div>
        </div>
        <div className="pageMeta">
          <span className="chip">UID: 23-9481</span>
          <span className="chip">PHC: Assigned</span>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tabBtn ${t === tab ? 'tabBtnActive' : ''}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid2">
          <div className="card cardAccentPurple">
            <h2 className="cardTitle">Overview</h2>
            <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
              Basic demographics, last triage summary, and care pathway.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="chip">Age: 28</span>
              <span className="chip">Pregnancy: Trimester 2</span>
              <span className="chip">PHC: Assigned</span>
            </div>
          </div>
          <div className="card cardAccentCyan">
            <h2 className="cardTitle">Recent Flags</h2>
            <ul className="list">
              <li>AI flagged elevated BP during pregnancy</li>
              <li>History suggests diabetes (2023)</li>
            </ul>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="chip chipDanger">Urgent</span>
              <span className="chip chipWarn">Review</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'History' && (
        <div className="grid2">
          <div className="card cardAccentRose">
            <h2 className="cardTitle">Timeline</h2>
            <table className="table" style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-02-10</td>
                  <td>ASHA intake recorded (voice)</td>
                  <td>Field</td>
                </tr>
                <tr>
                  <td>2025-11-03</td>
                  <td>Diabetes record detected</td>
                  <td>History</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card cardAccentCyan">
            <h2 className="cardTitle">Guideline Context (RAG)</h2>
            <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
              Retrieved guideline snippets and matched scenarios appear here after case analysis.
            </div>
          </div>
          <div className="card cardAccentPurple">
            <h2 className="cardTitle">Appointments</h2>
            <ul className="list">
              <li>2026-02-15 • PHC visit scheduled</li>
              <li>2026-02-22 • Follow-up tele-consult</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'Medications' && (
        <div className="grid2">
          <div className="card cardAccentPurple">
            <h2 className="cardTitle">Current</h2>
            <ul className="list">
              <li>Iron + Folic Acid • Daily</li>
              <li>Metformin • 500mg</li>
            </ul>
          </div>
          <div className="card cardAccentCyan">
            <h2 className="cardTitle">Medications</h2>
            <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
              OCR-parsed medication list (placeholder).
            </div>
          </div>
        </div>
      )}

      {tab === 'Risk Analysis' && (
        <div className="grid2">
          <div className="card cardAccentRose">
            <h2 className="cardTitle">Risk Overview</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="chip chipWarn">Obstetric risk</span>
              <span className="chip chipDanger">Urgent referral</span>
              <span className="chip">Confidence: High</span>
            </div>
          </div>
          <div className="card cardAccentCyan">
            <h2 className="cardTitle">Notes</h2>
            <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
              Risk classification is guideline-grounded where possible and intended to support clinician decisions.
            </div>
          </div>
          <div className="card cardAccentPurple">
            <h2 className="cardTitle">Vitals</h2>
            <div className="kv">
              <div className="kvRow">
                <div className="kvKey">BP</div>
                <div className="kvVal">140/90</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">Pulse</div>
                <div className="kvVal">92 bpm</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">SpO₂</div>
                <div className="kvVal">98%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Reports' && (
        <div className="card cardAccentPurple">
          <h2 className="cardTitle">Reports</h2>
          <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
            Export referrals and summaries (PDF preview placeholder).
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btnSecondary" type="button">
              Preview
            </button>
            <button className="btn btnPrimary" type="button">
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
