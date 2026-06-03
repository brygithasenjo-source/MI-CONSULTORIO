/**
 * PatientSidebar.jsx
 * Left panel in the patient profile view.
 * Shows patient data + edit/export/delete buttons.
 * Matches the reference design exactly.
 */
import { useState } from 'react'
import Avatar  from '@/components/ui/Avatar.jsx'
import Badge   from '@/components/ui/Badge.jsx'
import Button  from '@/components/ui/Button.jsx'
import Modal   from '@/components/ui/Modal.jsx'
import Input   from '@/components/ui/Input.jsx'

const ROW = ({ label, value }) => (
  <div
    style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', gap: '8px', fontSize: '12px',
      marginBottom: '8px',
    }}
  >
    <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '10px', letterSpacing: '0.3px', flexShrink: 0, textTransform: 'uppercase' }}>
      {label}
    </span>
    <span style={{ fontWeight: 600, textAlign: 'right', wordBreak: 'break-word', maxWidth: '140px' }}>
      {value || '—'}
    </span>
  </div>
)

export default function PatientSidebar({ patient, onUpdate, onDelete }) {
  const [showEdit, setShowEdit] = useState(false)
  const [draft,    setDraft]    = useState({ ...patient })

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  const handleSave = () => {
    onUpdate(draft)
    setShowEdit(false)
  }

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar paciente ${patient.full_name}?\n\nEsta acción no se puede deshacer.`)) {
      onDelete(patient.id)
    }
  }

  const handleExport = () => {
    alert(
      '📄 Exportar HC\n\n' +
      'En la versión con Supabase + pdfService, aquí se genera y descarga ' +
      'el PDF completo de la Historia Clínica con todos los datos del paciente.\n\n' +
      'Fase 5: implementar pdfService.exportClinicalHistory(patientId)'
    )
  }

  return (
    <>
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '24px 18px',
          textAlign: 'center',
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar name={patient.full_name} size={70} />
          <h2 style={{ marginTop: '12px', fontSize: '17px', fontWeight: 800 }}>
            {patient.full_name}
          </h2>
          <div style={{ margin: '6px 0' }}>
            <Badge color={patient.status === 'active' ? 'green' : 'gray'}>
              {patient.status === 'active' ? 'ACTIVO' : 'EN PAUSA'}
            </Badge>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Paciente desde {patient.start_date}
          </p>
        </div>

        {/* Data rows — exact match to reference image */}
        <div
          style={{
            marginTop: '16px',
            borderTop: '1px solid var(--border)',
            paddingTop: '14px',
            textAlign: 'left',
          }}
        >
          <ROW label="Edad"          value={patient.age ? `${patient.age} años` : null} />
          <ROW label="Modalidad"     value={patient.modality} />
          <ROW label="Frecuencia"    value={patient.frequency} />
          <ROW label="Monto sesión"  value={patient.session_price ? `S/. ${patient.session_price}` : null} />
          <ROW label="Próxima sesión" value={patient.next_session} />
          <ROW label="Email"         value={patient.email} />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <Button variant="outline" full size="sm" onClick={() => setShowEdit(true)}>
            ✏️ Editar paciente
          </Button>
          <Button variant="dark" full onClick={handleExport}>
            📥 Exportar HC
          </Button>
          <Button variant="danger" full size="sm" onClick={handleDelete}>
            🗑 Eliminar
          </Button>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Editar Paciente"
        maxWidth={480}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <Input label="Nombre completo" value={draft.full_name}    onChange={set('full_name')} />
          </div>
          <Input label="Edad"       type="number" value={draft.age || ''}           onChange={set('age')} />
          <Input label="Email"      type="email"  value={draft.email || ''}         onChange={set('email')} />
          <Input label="Teléfono"               value={draft.phone || ''}         onChange={set('phone')} />
          <Input label="Monto/sesión" type="number" value={draft.session_price || ''} onChange={set('session_price')} />
          <Input
            label="Modalidad" as="select"
            value={draft.modality} onChange={set('modality')}
            options={['Online', 'Presencial', 'Mixto']}
          />
          <Input
            label="Frecuencia" as="select"
            value={draft.frequency} onChange={set('frequency')}
            options={['Semanal', 'Quincenal', 'Mensual', 'A demanda']}
          />
          <Input
            label="Próxima sesión"
            value={draft.next_session || ''}
            onChange={set('next_session')}
            placeholder="Ej. Mar 3/6 - 09:00hs"
          />
          <Input
            label="Estado" as="select"
            value={draft.status} onChange={set('status')}
            options={[
              { value: 'active',     label: 'Activo' },
              { value: 'pause',      label: 'En pausa' },
              { value: 'discharged', label: 'Alta' },
            ]}
          />
          <div style={{ gridColumn: '1/-1' }}>
            <Input
              label="Notas" as="textarea" rows={2}
              value={draft.notes || ''} onChange={set('notes')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <Button variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button variant="dark"    onClick={handleSave}>Guardar cambios</Button>
        </div>
      </Modal>
    </>
  )
}
