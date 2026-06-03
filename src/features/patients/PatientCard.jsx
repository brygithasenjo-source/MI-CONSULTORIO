/**
 * PatientCard.jsx
 * Card shown in the Dashboard grid for each patient.
 * Matches the reference design: avatar, name, badge, progress bar, tags.
 */
import Avatar      from '@/components/ui/Avatar.jsx'
import Badge       from '@/components/ui/Badge.jsx'
import ProgressBar from '@/components/ui/ProgressBar.jsx'
import Card        from '@/components/ui/Card.jsx'

export default function PatientCard({ patient, hcPct, onClick }) {
  const statusColor = patient.status === 'active' ? 'green' : 'gray'
  const statusLabel = patient.status === 'active' ? 'ACTIVO' : 'EN PAUSA'

  return (
    <Card
      onClick={onClick}
      hover
      style={{ padding: '16px 18px', cursor: 'pointer' }}
    >
      {/* Top row: avatar + name + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', marginBottom: '10px' }}>
        <Avatar name={patient.full_name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
            <p style={{ fontWeight: 700, fontSize: '14px' }} className="truncate">
              {patient.full_name}
            </p>
            <Badge color={statusColor}>{statusLabel}</Badge>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Paciente desde {patient.start_date}
          </p>
        </div>
      </div>

      {/* Info row */}
      <div
        style={{
          display: 'flex', gap: '14px', fontSize: '12px',
          color: 'var(--text-muted)', marginBottom: '8px', flexWrap: 'wrap',
        }}
      >
        <span>📅 {patient.frequency} · {patient.modality}</span>
        <span>🎂 {patient.age} años</span>
      </div>

      {/* HC progress */}
      <ProgressBar pct={hcPct} />

      {/* Tags */}
      {patient.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '9px' }}>
          {patient.tags.map((tag, i) => (
            <Badge key={i} color="gray">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '9px' }}>
        ⏱ Paciente desde {patient.start_date}
      </p>
    </Card>
  )
}
