import { useState } from 'react'
import './App.css'
import VoiceInput from './components/VoiceInput'
import CaseResult from './components/CaseResult'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const onSubmitText = async (text) => {
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${BACKEND_URL}/analyze_case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Request failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Sanjeevani – AI Triage Assistant</h1>
        <p>Assist ASHA workers with safe, non-diagnostic triage</p>
      </header>
      <section className="inputSection">
        <VoiceInput onSubmit={onSubmitText} loading={loading} />
        {error && <div className="error">{error}</div>}
      </section>
      <section className="resultSection">
        <CaseResult data={result} />
      </section>
    </div>
  )
}

export default App
