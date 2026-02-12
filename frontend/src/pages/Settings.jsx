export default function Settings() {
  return (
    <div className="stack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Settings</h1>
          <div className="helperText">Configure preferences and privacy guards for the demo.</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card cardAccentPurple">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Preferences</h2>
              <p className="cardSub">Basic toggles (placeholders).</p>
            </div>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <label className="fieldRow">
              <span className="fieldLabel">Privacy guard</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <label className="fieldRow">
              <span className="fieldLabel">Default language</span>
              <select className="select" defaultValue="hi">
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
                <option value="ta">Tamil</option>
              </select>
            </label>
          </div>
        </div>

        <div className="card cardAccentCyan">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Notifications</h2>
              <p className="cardSub">Alerts for demo flows.</p>
            </div>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <label className="fieldRow">
              <span className="fieldLabel">Agent events</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <label className="fieldRow">
              <span className="fieldLabel">Critical alerts</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
          </div>
        </div>

        <div className="card cardAccentRose">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Privacy & Data</h2>
              <p className="cardSub">Anonymization and retention.</p>
            </div>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <label className="fieldRow">
              <span className="fieldLabel">Anonymize names</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <label className="fieldRow">
              <span className="fieldLabel">Retention</span>
              <select className="select" defaultValue="30">
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
          </div>
        </div>

        <div className="card cardAccentPurple">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Regional</h2>
              <p className="cardSub">Localization for demo.</p>
            </div>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <label className="fieldRow">
              <span className="fieldLabel">Region</span>
              <select className="select" defaultValue="bihar">
                <option value="bihar">Bihar</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
              </select>
            </label>
            <label className="fieldRow">
              <span className="fieldLabel">Units</span>
              <select className="select" defaultValue="metric">
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </label>
          </div>
        </div>

        <div className="card cardAccentCyan">
          <div className="cardHeader">
            <div>
              <h2 className="cardTitle">Agent Controls</h2>
              <p className="cardSub">Demo-ready toggles.</p>
            </div>
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <label className="fieldRow">
              <span className="fieldLabel">Verbose logs</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
            <label className="fieldRow">
              <span className="fieldLabel">Demo mode</span>
              <select className="select" defaultValue="on">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btnSecondary" type="button">Reset</button>
        <button className="btn btnPrimary" type="button">Save Changes</button>
      </div>
    </div>
  )
}
