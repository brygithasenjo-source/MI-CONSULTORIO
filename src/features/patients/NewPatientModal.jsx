/**
 * NewPatientModal.jsx
 * Form modal to create a new patient.
 *
 * Phase 1: calls onSave(data) which updates local useState.
 * Phase 4: onSave will call patientService.createPatient(data).
 */
import { useState } from 'react'
import Modal  from '@/components/ui/Modal.jsx'
import Input  from '@/components/ui/Input.jsx'
import Button from '@/components/ui/Button.jsx'

const EMPTY = {
  full_name: '', age: '', email: '', phone: '',
  modality: 'Online', frequency: 'Semanal',
  session_price: '', status: 'active',
  start_date: new Date().toISOString().split('T')[0],
  notes: '', tags: '',
}

export default function NewPatientModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSave = () => {
    if (!form.full_name.trim()) {
      setError('El nombre completo es obligatorio.')
      return
    }
    // Build today's date as DD/MM/YYYY for display
    const d = new Date()
    const display = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`

    onSave({
      ...form,
      id:            `p${Date.now()}`,
      user_id:       'demo-user',
      age:           parseInt(form.age)          || 0,
      session_price: parseFloat(form.session_price) || 0,
      tags:          form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      start_date:    display,
      next_session:  null,
      created_at:    new Date().toISOString(),
    })
    setForm(EMPTY)
    setError('')
    onClose()
  }

  const handleClose = () => { setForm(EMPTY); setError(''); onClose() }

  return (
    <Modal open={open} onClose={handleClose} title="Nuevo Paciente" maxWidth={490}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Nombre completo"
            value={form.full_name}
            onChange={set('full_name')}
            placeholder="Ej. Ana García"
            required
          />
        </div>
        <Input label="Edad"  type="number" value={form.age}   onChange={set('age')}   placeholder="25" />
        <Input label="Email" type="email"  value={form.email} onChange={set('email')} placeholder="ana@email.com" />
        <Input label="Teléfono" value={form.phone} onChange={set('phone')} placeholder="+51 999 000 111" />
        <Input label="Monto/sesión (S/.)" type="number" value={form.session_price} onChange={set('session_price')} placeholder="120" />
        <Input
          label="Modalidad" as="select"
          value={form.modality} onChange={set('modality')}
          options={['Online', 'Presencial', 'Mixto']}
        />
        <Input
          label="Frecuencia" as="select"
          value={form.frequency} onChange={set('frequency')}
          options={['Semanal', 'Quincenal', 'Mensual', 'A demanda']}
        />
        <Input
          label="Estado" as="select"
          value={form.status} onChange={set('status')}
          options={[
            { value: 'active',     label: 'Activo' },
            { value: 'pause',      label: 'En pausa' },
            { value: 'discharged', label: 'Alta' },
          ]}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Tags (separados por coma)"
            value={form.tags}
            onChange={set('tags')}
            placeholder="ansiedad, laboral, pareja"
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="Notas iniciales" as="textarea" rows={2}
            value={form.notes} onChange={set('notes')}
            placeholder="Observaciones relevantes..."
          />
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '13px', marginTop: '4px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <Button variant="outline" onClick={handleClose}>Cancelar</Button>
        <Button variant="dark"    onClick={handleSave}>Guardar Paciente</Button>
      </div>
    </Modal>
  )
}
