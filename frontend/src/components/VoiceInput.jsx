import { useEffect, useRef, useState } from 'react'

const BACKEND_URL = 'http://localhost:8000'

export default function VoiceInput({ onSubmit, loading, language = 'hi', addAgentLog }) {
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSubmit(text.trim())
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      addAgentLog?.(`Agent A: Recording started (${language}).`)
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('language', language)
        form.append('audio', blob, 'audio.webm')
        addAgentLog?.('Agent A: Uploading audio for transcription…')

        try {
          const res = await fetch(`${BACKEND_URL}/transcribe`, {
            method: 'POST',
            body: form,
          })

          if (!res.ok) {
            throw new Error(`Server error: ${res.statusText}`)
          }

          const data = await res.json()

          if (data.error) {
            addAgentLog?.(`Agent A: Transcription error (${data.error}).`)
            return
          }

          const transcribed = data.text?.trim() || ''
          addAgentLog?.(transcribed ? 'Agent A: Transcription completed.' : 'Agent A: No speech detected.')

          if (!transcribed) {
            return
          }

          setText(transcribed)
        } catch (err) {
          addAgentLog?.(`Agent A: Transcription failed (${err.message}).`)
        } finally {
          stream.getTracks().forEach(track => track.stop())
        }
      }
      mr.start()
      mediaRecorderRef.current = mr
      setRecording(true)
    } catch (e) {
      addAgentLog?.(`Agent A: Microphone access failed (${e.message}).`)
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setRecording(false)
        addAgentLog?.('Agent A: Recording stopped.')
      }
    } catch (err) {
      addAgentLog?.(`Agent A: Stop recording error (${err.message}).`)
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="recorderTop">
        <button
          type="button"
          className={`micButton ${recording ? 'micButtonRecording' : ''}`}
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          aria-label={recording ? 'Stop recording' : 'Start recording'}
        >
          <div className="micInner">{recording ? '■' : '🎤'}</div>
        </button>
        <div className={`wave ${recording ? 'waveActive' : ''}`}>
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

      <div className="fieldLabel">Live Transcription</div>
      <textarea
        className="textarea"
        placeholder="Transcription will appear here. You can also type symptoms directly."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button type="button" className="btn btnSecondary" onClick={() => setText('')} disabled={loading || !text}>
          Clear
        </button>
        <button type="submit" className="btn btnPrimary" disabled={loading || !text.trim()}>
          {loading ? 'Analyzing…' : 'Analyze Case'}
        </button>
      </div>
    </form>
  )
}
