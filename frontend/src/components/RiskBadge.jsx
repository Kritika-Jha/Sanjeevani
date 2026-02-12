export default function RiskBadge({ level }) {
  const lv = (level || '').toLowerCase()
  const color =
    lv === 'high' ? '#fb7185' :
    lv === 'medium' ? '#f59e0b' :
    lv === 'low' ? '#34d399' : '#94a3b8'
  const bg =
    lv === 'high' ? 'rgba(251,113,133,.14)' :
    lv === 'medium' ? 'rgba(245,158,11,.14)' :
    lv === 'low' ? 'rgba(52,211,153,.14)' : 'rgba(148,163,184,.10)'
  return (
    <span
      style={{
        background: bg,
        color,
        padding: '7px 10px',
        borderRadius: 999,
        fontWeight: 800,
        border: `1px solid ${color}33`,
        letterSpacing: '.01em'
      }}
    >
      {level || 'Unknown'}
    </span>
  )
}
