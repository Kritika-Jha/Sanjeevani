import { Link } from 'react-router-dom'
import { Mic, BookOpen, Activity, Database, FileText, PlayCircle } from 'lucide-react'

export default function Landing() {
  return (
    <div className="stack">
      <div className="card cardAccentPurple" style={{ boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: -120,
            background: 'radial-gradient(circle at 30% 20%, rgba(124,58,237,.22), transparent 55%), radial-gradient(circle at 70% 40%, rgba(6,182,212,.18), transparent 55%)'
          }}
        />
        <div style={{ position: 'relative' }}>
          <h1 className="pageTitle" style={{ fontSize: '1.85rem' }}>
            Empowering the Last Mile of Indian Healthcare with Agentic AI
          </h1>
          <div className="helperText" style={{ fontSize: '1.05rem', color: 'var(--textSecondary)', maxWidth: 760, marginTop: 10 }}>
            Real-time, non-diagnostic triage support for ASHA workers with multilingual voice intake, guideline-grounded reasoning, and doctor-ready summaries.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <Link to="/asha" className="btn btnPrimary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Open ASHA Dashboard
            </Link>
            <Link to="/agents" className="btn btnSecondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              View Agent Logs
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mic size={14} /> Voice
            </span>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={14} /> Guidelines
            </span>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} /> Risk
            </span>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="fieldLabel">Live signal</div>
            <div className="wave" style={{ marginTop: 8 }}>
              <div className="waveBars" aria-hidden="true">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <section className="card cardAccentRose">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Problem</h2>
              <p className="cardSub">Why agent support matters.</p>
            </div>
            <span className="navIcon iconAlerts"><Activity size={12} /></span>
          </div>
          <p className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
            Rural triage is delayed by travel time, fragmented records, and limited clinical availability. ASHA workers need consistent guidance, fast escalation, and clean summaries for doctors.
          </p>
        </section>
        <section className="card cardAccentCyan">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Solution</h2>
              <p className="cardSub">Agent pipeline.</p>
            </div>
            <span className="navIcon iconAgents"><BookOpen size={12} /></span>
          </div>
          <ul className="list">
            <li>Agent A: Multilingual voice intake and normalization</li>
            <li>Agent B: Guideline retrieval and history cross-reference</li>
            <li>Agent C: Risk scoring, red-flag escalation, and summary drafting</li>
          </ul>
        </section>
      </div>

      <section className="card cardAccentPurple">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Architecture</h2>
            <p className="cardSub">System flow.</p>
          </div>
          <span className="navIcon iconAnalytics"><Database size={12} /></span>
        </div>
        <div className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
          Voice/OCR → FastAPI → LLM + FAISS (RAG) → Structured JSON → ASHA & Doctor dashboards
        </div>
      </section>

      <div className="grid2">
        <section className="card cardAccentPurple">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Impact Metrics</h2>
              <p className="cardSub">What success looks like.</p>
            </div>
            <span className="navIcon iconDashboard"><FileText size={12} /></span>
          </div>
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Red flag detection rate</td>
                <td>Faster escalation for emergencies</td>
              </tr>
              <tr>
                <td>Avg. doctor review time</td>
                <td>Clean summaries reduce cognitive load</td>
              </tr>
              <tr>
                <td>Coverage</td>
                <td>Scales across sub-centres and PHCs</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="card cardAccentCyan">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Live Demo</h2>
              <p className="cardSub">Try the intake flow.</p>
            </div>
            <span className="navIcon iconNewCase"><PlayCircle size={12} /></span>
          </div>
          <p className="helperText" style={{ color: 'var(--textSecondary)', marginTop: 10 }}>
            Use the ASHA Dashboard to record symptoms, review transcription, and run triage. Open Agent Logs to show the reasoning trail during the demo.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Link to="/asha" className="btn btnPrimary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Start a Case
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
