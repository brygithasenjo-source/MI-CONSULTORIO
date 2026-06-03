/**
 * StatCard.jsx
 * KPI card used in Dashboard and Finances.
 */
import Card from './Card.jsx'

export default function StatCard({
  label,
  value,
  sub,
  color = 'var(--text)',
  icon,
  dark = false,  // dark green background variant
}) {
  if (dark) {
    return (
      <div
        style={{
          background: 'var(--green-dark)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--green-dark)',
          padding: '14px 16px',
        }}
      >
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '5px' }}>
          {label}
        </p>
        <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{value}</p>
        {sub && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{sub}</p>}
      </div>
    )
  }

  return (
    <Card style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '5px',
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: '24px', fontWeight: 800, color }}>{value}</p>
          {sub && (
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <span style={{ fontSize: '20px', opacity: 0.35, marginLeft: '8px' }}>{icon}</span>
        )}
      </div>
    </Card>
  )
}
