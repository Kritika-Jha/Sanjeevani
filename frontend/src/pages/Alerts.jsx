export default function Alerts() {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Alerts</h1>
          <div className="helperText">Urgent flags and follow-ups from recent ASHA cases.</div>
        </div>
        <div className="pageMeta">
          <span className="chip">Live</span>
        </div>
      </div>
      <div className="grid2">
        <div className="card cardAccentCyan">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Summary</h2>
              <p className="cardSub">Real-time alert counts and severity.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="chip chipDanger">Critical: 3</span>
            <span className="chip chipWarn">Warning: 6</span>
            <span className="chip">Info: 9</span>
          </div>
        </div>
        <div className="card cardAccentRose">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Escalations</h2>
              <p className="cardSub">Top urgent referrals pending action.</p>
            </div>
          </div>
          <div className="alertList">
            <div className="alertRow alertRowDanger">
              <div className="alertLeft">
                <span className="navIcon iconR">!</span>
                <div>
                  <div className="agentName">Postpartum hemorrhage risk</div>
                  <div className="agentState">Immediate attention</div>
                </div>
              </div>
              <span className="chip chipDanger">Escalated</span>
            </div>
            <div className="alertRow alertRowDanger">
              <div className="alertLeft">
                <span className="navIcon iconR">!</span>
                <div>
                  <div className="agentName">Elevated BP during pregnancy</div>
                  <div className="agentState">Referral recommended</div>
                </div>
              </div>
              <span className="chip chipDanger">Urgent</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card cardAccentPurple">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">Today</h2>
            <p className="cardSub">Auto-classified red flags for rapid action.</p>
          </div>
        </div>
        <div className="alertList">
          <div className="alertRow alertRowDanger">
            <div className="alertLeft">
              <span className="navIcon iconR">!</span>
              <div>
                <div className="agentName">Elevated BP during pregnancy</div>
                <div className="agentState">Referral recommended</div>
              </div>
            </div>
            <span className="chip chipDanger">Pending</span>
          </div>
          <div className="alertRow alertRowWarn">
            <div className="alertLeft">
              <span className="navIcon iconB">!</span>
              <div>
                <div className="agentName">Dehydration</div>
                <div className="agentState">Oral rehydration advised</div>
              </div>
            </div>
            <span className="chip chipWarn">Follow-up</span>
          </div>
          <div className="alertRow alertRowOk">
            <div className="alertLeft">
              <span className="navIcon iconC">✓</span>
              <div>
                <div className="agentName">Medication adherence</div>
                <div className="agentState">Counseling done</div>
              </div>
            </div>
            <span className="chip chipOk">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  )
}
