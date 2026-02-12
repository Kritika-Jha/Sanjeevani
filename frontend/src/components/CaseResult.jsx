import RiskBadge from './RiskBadge'

export default function CaseResult({ data }) {
  if (!data) return <div className="helperText">Enter symptoms and analyze the case to generate a structured summary.</div>
  const { symptoms = [], risk_level = '', possible_risk_pattern = '', recommended_actions = [], referral_needed = false, urgent_alert = false, retrieved_contexts = [] } = data
  const soap = data.soap_note || {}
  const insights = data.graph_insights || []

  const downloadSoapPdf = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      doc.setFontSize(12)
      doc.text('SOAP Note', 10, 10)
      doc.text(`Subjective: ${soap.subjective || ''}`, 10, 20)
      doc.text(`Objective: ${soap.objective || ''}`, 10, 30)
      doc.text(`Assessment: ${soap.assessment || ''}`, 10, 40)
      doc.text(`Plan: ${soap.plan || ''}`, 10, 50)
      doc.save('soap_note.pdf')
    } catch {
      alert('PDF generation failed. Please install jspdf or try again.')
    }
  }
  return (
    <div className="stack">
      {urgent_alert && <div className="bannerDanger">Urgent alert: immediate referral recommended.</div>}

      <div className="grid2">
        <div>
          <div className="fieldLabel">Symptoms</div>
          <ul className="list">
            {symptoms.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <div>
            <div className="fieldLabel">Risk Level</div>
            <div style={{ marginTop: 8 }}>
              <RiskBadge level={risk_level} />
            </div>
          </div>
          <div className="helperText">{possible_risk_pattern}</div>
          <div className="helperText">
            <span className="fieldLabel">Referral Needed:</span> {referral_needed ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {!!insights.length && (
        <div>
          <div className="fieldLabel">Cross-referenced risks</div>
          <div className="helperText">{insights.join(', ')}</div>
        </div>
      )}

      <div>
        <div className="fieldLabel">Retrieved Guidelines</div>
        <ul className="list">
          {retrieved_contexts.map((c, i) => (
            <li key={i}>
              {c.title} • Risk: {c.risk} • Referral: {c.referral ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="fieldLabel">Recommended Actions</div>
        <ul className="list">
          {recommended_actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="fieldLabel">SOAP Note</div>
        <div className="kv">
          <div className="kvRow">
            <div className="kvKey">Subjective</div>
            <div className="kvVal">{soap.subjective}</div>
          </div>
          <div className="kvRow">
            <div className="kvKey">Objective</div>
            <div className="kvVal">{soap.objective}</div>
          </div>
          <div className="kvRow">
            <div className="kvKey">Assessment</div>
            <div className="kvVal">{soap.assessment}</div>
          </div>
          <div className="kvRow">
            <div className="kvKey">Plan</div>
            <div className="kvVal">{soap.plan}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btnSecondary" onClick={downloadSoapPdf}>
            Download SOAP (PDF)
          </button>
        </div>
      </div>
    </div>
  )
}
