/**
 * EmptyState.jsx
 * Centered placeholder shown when a list has no items.
 */

export default function EmptyState({ icon = '📋', title, description, action }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        color: 'var(--text-muted)',
        background: 'var(--bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
      }}
    >
      <div style={{ fontSize: '38px', marginBottom: '12px', opacity: 0.45 }}>{icon}</div>
      <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '6px', fontSize: '14px' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: '13px', marginBottom: action ? '16px' : 0 }}>{description}</p>
      )}
      {action}
    </div>
  )
}
