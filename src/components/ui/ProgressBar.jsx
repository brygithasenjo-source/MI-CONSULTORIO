/**
 * ProgressBar.jsx
 * Compact labeled progress bar for Historia Clínica completion %.
 * Color: green ≥70 | orange ≥40 | red <40
 */

export default function ProgressBar({ pct = 0, label = 'HC completada' }) {
  const color =
    pct >= 70 ? 'var(--green)' :
    pct >= 40 ? 'var(--orange)' :
    'var(--red)'

  return (
    <div style={{ marginTop: '8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div
        style={{
          background: 'var(--border)',
          borderRadius: '99px',
          height: '5px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            background: color,
            borderRadius: '99px',
            height: '5px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
