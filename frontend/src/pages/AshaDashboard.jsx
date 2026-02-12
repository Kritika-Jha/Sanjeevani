import VoiceInput from '../components/VoiceInput'
import CaseResult from '../components/CaseResult'
import { useState } from 'react'

const BACKEND_URL = 'http://localhost:8000'

export default function AshaDashboard({ loading, setLoading, addAgentLog, openAgentPanel }) {
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [lang, setLang] = useState('hi')

  const onSubmitText = async (text) => {
    setError('')
    setLoading(true)
    setResult(null)
    addAgentLog?.('Agent A: Transcribing and normalizing intake…')
    try {
      const res = await fetch(`${BACKEND_URL}/analyze_case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      addAgentLog?.('Agent B: Retrieved guideline context and matched rural scenarios.')
      addAgentLog?.('Agent C: Completed risk classification and generated case summary.')
      setResult(data)
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">New Case</h1>
          <div className="helperText">Structured triage support for ASHA field intake (non-diagnostic).</div>
        </div>
        <div className="pageMeta">
          <div className="fieldRow">
            <div className="fieldLabel">Language</div>
            <select className="select" value={lang} onChange={(e) => setLang(e.target.value)} disabled={loading}>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="mr">Marathi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          <div className="statusPill">
            <span className="dot" />
            Agents Active
          </div>
          <button className="btn btnSecondary" onClick={openAgentPanel}>
            Agent Panel
          </button>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Voice Recorder</h2>
              <p className="cardSub">Tap to record, then review the transcription before analysis.</p>
            </div>
          </div>
          <div className="bannerNote">This tool assists triage. It does not diagnose or prescribe medication.</div>
          <div style={{ height: 12 }} />
          <VoiceInput language={lang} onSubmit={onSubmitText} loading={loading} addAgentLog={addAgentLog} />
          {error && <div className="errorText" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">AI Processing Status</h2>
              <p className="cardSub">Real-time agent pipeline visibility for auditability.</p>
            </div>
          </div>
          <div className="agentList">
            <div className="agentRow">
              <div className="agentLeft">
                <span className="navIcon">A</span>
                <div>
                  <div className="agentName">Agent A</div>
                  <div className="agentState">{loading ? 'Transcribing' : 'Idle'}</div>
                </div>
              </div>
              <span className={`chip ${loading ? 'chipWarn' : ''}`}>{loading ? 'Running' : 'Ready'}</span>
            </div>
            <div className="agentRow">
              <div className="agentLeft">
                <span className="navIcon">B</span>
                <div>
                  <div className="agentName">Agent B</div>
                  <div className="agentState">{loading ? 'Checking history & guidelines' : 'Idle'}</div>
                </div>
              </div>
              <span className={`chip ${loading ? 'chipWarn' : ''}`}>{loading ? 'Running' : 'Ready'}</span>
            </div>
            <div className="agentRow">
              <div className="agentLeft">
                <span className="navIcon">C</span>
                <div>
                  <div className="agentName">Agent C</div>
                  <div className="agentState">{loading ? 'Risk analysis' : 'Idle'}</div>
                </div>
              </div>
              <span className={`chip ${loading ? 'chipWarn' : ''}`}>{loading ? 'Running' : 'Ready'}</span>
            </div>
            <div className="agentRow">
              <div className="agentLeft">
                <span className="navIcon">R</span>
                <div>
                  <div className="agentName">Risk Score</div>
                  <div className="agentState">{result?.risk_level ? `Current: ${result.risk_level}` : 'Pending'}</div>
                </div>
              </div>
              <span
                className={`chip ${
                  (result?.risk_level || '').toLowerCase() === 'high'
                    ? 'chipDanger'
                    : (result?.risk_level || '').toLowerCase() === 'medium'
                      ? 'chipWarn'
                      : (result?.risk_level || '').toLowerCase() === 'low'
                        ? 'chipOk'
                        : ''
                }`}
              >
                {result?.risk_level || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Generated Case Summary</h2>
            <p className="cardSub">Doctor-ready structured summary and actions.</p>
          </div>
        </div>
        <CaseResult data={result} />
      </div>
    </div>
  )
}
