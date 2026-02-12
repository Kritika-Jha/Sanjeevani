import RiskBadge from './RiskBadge'

export default function CaseResult({ data }) {
  if (!data) return <div className="placeholder">Enter symptoms and analyze the case.</div>
  const { symptoms = [], risk_level = '', possible_risk_pattern = '', recommended_actions = [], referral_needed = false, urgent_alert = false } = data
  return (
    <div className="resultCard">
      {urgent_alert && <div className="alertBanner">Urgent Alert</div>}
      <div className="row">
        <div className="col">
          <h3>Symptoms</h3>
          <ul className="list">
            {symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="col status">
          <h3>Risk Level</h3>
          <RiskBadge level={risk_level} />
          <div className="pattern">{possible_risk_pattern}</div>
          <div className="referral">Referral Needed: {referral_needed ? 'Yes' : 'No'}</div>
        </div>
      </div>
      <div className="actionsRow">
        <h3>Recommended Actions</h3>
        <ul className="list">
          {recommended_actions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>
    </div>
  )
}
