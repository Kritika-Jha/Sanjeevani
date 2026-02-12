export default function RiskBadge({ level }) {
  const lv = (level || '').toLowerCase()
  const color =
    lv === 'high' ? '#e11d48' :
    lv === 'medium' ? '#f59e0b' :
    lv === 'low' ? '#10b981' : '#6b7280'
  return (
    <span style={{ backgroundColor: color, color: '#fff', padding: '6px 10px', borderRadius: '8px', fontWeight: 600 }}>
      {level || 'Unknown'}
    </span>
  )
}
