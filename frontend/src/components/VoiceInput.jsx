import { useState } from 'react'

export default function VoiceInput({ onSubmit, loading }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSubmit(text.trim())
  }

  return (
    <form className="voiceInput" onSubmit={handleSubmit}>
      <textarea
        className="textArea"
        placeholder="Enter symptoms, e.g., 'Patient has fever for 3 days and yellowing of eyes'"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <div className="actions">
        <button type="submit" disabled={loading || !text.trim()} className="submitBtn">
          {loading ? 'Analyzing...' : 'Analyze Case'}
        </button>
      </div>
    </form>
  )
}
