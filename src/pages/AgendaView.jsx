/**
 * AgendaView.jsx
 * Monthly calendar + upcoming sessions + notes panel.
 * Matches reference image 3 (Agenda Clínica).
 */
import { useState } from 'react'
import Card   from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import Avatar from '@/components/ui/Avatar.jsx'
import Modal  from '@/components/ui/Modal.jsx'
import Input  from '@/components/ui/Input.jsx'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const STATUS_COLORS = {
  confirmado:  'var(--green)',
  a_confirmar: 'var(--orange)',
  'canceló':   'var(--red)',
  reagendar:   '#8B5CF6',
  baja:        '#6B7280',
}

const STATUS_LABELS = {
  confirmado:  'Confirmado',
  a_confirmar: 'A confirmar',
  'canceló':   'Canceló',
  reagendar:   'Reagendar',
  baja:        'Baja',
}

const EMPTY_APP = { patient_id:'', date:'', time:'09:00', duration:'50 min', modality:'Online', status:'a_confirmar', notes:'' }

export default function AgendaView({ store }) {
  const { appointments, setAppointments, patients, reminders, setReminders } = store

  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1))
  const [showModal,   setShowModal]   = useState(false)
  const [newApp,      setNewApp]      = useState({ ...EMPTY_APP })
  const [newReminder, setNewReminder] = useState('')
  const [notesTab,    setNotesTab]    = useState('todo')
  const [clinNote,    setClinNote]    = useState('')

  const year      = currentDate.getFullYear()
  const month     = currentDate.getMonth()
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMo  = new Date(year, month + 1, 0).getDate()
  const today     = new Date()

  const getApps = (day) => {
    const ds = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return appointments.filter((a) => a.date === ds)
  }

  const upcoming = appointments
    .filter((a) => a.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 8)

  const setA = (f) => (e) => setNewApp((a) => ({ ...a, [f]: e.target.value }))

  const addApp = () => {
    if (!newApp.patient_id || !newApp.date) { alert('Selecciona paciente y fecha.'); return }
    setAppointments((prev) => [{ ...newApp, id: `ap${Date.now()}`, user_id: 'demo-user', created_at: new Date().toISOString() }, ...prev])
    setNewApp({ ...EMPTY_APP })
    setShowModal(false)
  }

  const addReminder = () => {
    if (!newReminder.trim()) return
    setReminders((prev) => [{ id: `r${Date.now()}`, user_id: 'demo-user', title: newReminder, completed: false }, ...prev])
    setNewReminder('')
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  return (
    <div className="fade-in page-pad" style={{ padding: '24px 28px', maxWidth: '1300px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Agenda Clínica</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '3px' }}>Gestiona tus horarios y visualiza tu semana</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--green-dark)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font)' }}>Calendario</button>
          <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--white)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font)' }}>Mis Horarios</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: STATUS_COLORS[k] }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Calendar ── */}
        <Card style={{ flex: 1, minWidth: '300px', padding: '18px' }}>
          {/* Calendar nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1 }}>‹</button>
              <button onClick={() => setCurrentDate(new Date())} style={{ padding: '4px 10px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--white)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font)' }}>Hoy</button>
              <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1 }}>›</button>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginLeft: '4px' }}>{MONTH_NAMES[month]} {year}</h2>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['Mes', 'Semana'].map((v) => (
                <button key={v} style={{ padding: '5px 12px', borderRadius: '7px', border: '1px solid var(--border)', background: v === 'Mes' ? 'var(--green-dark)' : 'var(--white)', color: v === 'Mes' ? '#fff' : 'var(--text)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font)' }}>{v}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {DAY_NAMES.map((d) => (
              <div key={d} style={{ background: 'var(--bg)', padding: '7px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{d}</div>
            ))}
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`e${i}`} style={{ background: 'var(--white)', minHeight: '72px' }} />
            ))}
            {Array(daysInMo).fill(null).map((_, i) => {
              const day    = i + 1
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
              const apps   = getApps(day)
              return (
                <div key={day} style={{ background: 'var(--white)', minHeight: '72px', padding: '5px 3px' }}>
                  <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: isToday ? 700 : 400, background: isToday ? 'var(--green-dark)' : 'transparent', color: isToday ? '#fff' : 'var(--text)' }}>
                    {day}
                  </span>
                  <div style={{ marginTop: '2px' }}>
                    {apps.slice(0, 2).map((a) => {
                      const p = patients.find((x) => x.id === a.patient_id)
                      return (
                        <div key={a.id} style={{ fontSize: '9px', padding: '2px 3px', borderRadius: '4px', marginBottom: '1px', background: `${STATUS_COLORS[a.status] ?? 'var(--border)'}18`, borderLeft: `2px solid ${STATUS_COLORS[a.status] ?? 'var(--border)'}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.time} · {p?.full_name?.split(' ')[0] ?? '?'}
                        </div>
                      )
                    })}
                    {apps.length > 2 && <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>+{apps.length - 2}</div>}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <Button variant="dark" onClick={() => setShowModal(true)}>+ Agendar Cita</Button>
          </div>
        </Card>

        {/* ── Sidebar panel ── */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '220px' }}>

          {/* Upcoming sessions */}
          <Card style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>📅 Próximas sesiones</h3>
            {upcoming.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sin sesiones próximas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {upcoming.map((a) => {
                  const p = patients.find((x) => x.id === a.patient_id)
                  return (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 10px', background: 'var(--bg)', borderRadius: '9px' }}>
                      <Avatar name={p?.full_name ?? '?'} size={28} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.full_name?.split(' ')[0] ?? '—'}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{a.date} · {a.time} · {a.duration}</p>
                      </div>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLORS[a.status] ?? 'var(--border)', flexShrink: 0 }} />
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Notes panel */}
          <Card style={{ padding: '16px', flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>📝 Mis notas</h3>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '12px', background: 'var(--bg)', borderRadius: '8px', padding: '3px' }}>
              {[['todo', 'To-do'], ['clinical', 'Notas clínicas']].map(([v, l]) => (
                <button key={v} onClick={() => setNotesTab(v)} style={{ flex: 1, padding: '5px 6px', borderRadius: '6px', border: 'none', background: notesTab === v ? 'var(--white)' : 'transparent', fontWeight: notesTab === v ? 700 : 400, fontSize: '11px', cursor: 'pointer', color: notesTab === v ? 'var(--green-dark)' : 'var(--text-muted)', fontFamily: 'var(--font)' }}>{l}</button>
              ))}
            </div>

            {notesTab === 'todo' ? (
              <>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <input
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addReminder() }}
                    placeholder="Nuevo recordatorio..."
                    style={{ flex: 1, padding: '6px 9px', borderRadius: '7px', border: '1px solid var(--border)', fontSize: '12px', fontFamily: 'var(--font)', outline: 'none' }}
                  />
                  <button onClick={addReminder} style={{ padding: '6px 10px', borderRadius: '7px', background: 'var(--green-dark)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>+</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {reminders.map((r) => (
                    <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', cursor: 'pointer', textDecoration: r.completed ? 'line-through' : 'none', color: r.completed ? 'var(--text-muted)' : 'var(--text)' }}>
                      <input
                        type="checkbox"
                        checked={r.completed}
                        onChange={() => setReminders((prev) => prev.map((x) => x.id === r.id ? { ...x, completed: !x.completed } : x))}
                        style={{ accentColor: 'var(--green)' }}
                      />
                      {r.title}
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <textarea
                value={clinNote}
                onChange={(e) => setClinNote(e.target.value)}
                placeholder="Notas clínicas del día..."
                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', minHeight: '100px', resize: 'vertical', background: 'var(--beige)', fontFamily: 'var(--font)' }}
              />
            )}
          </Card>
        </div>
      </div>

      {/* Appointment modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Agendar Cita" maxWidth={440}>
        <Input label="Paciente" as="select" value={newApp.patient_id} onChange={setA('patient_id')}
          options={[{ value: '', label: '— Seleccionar —' }, ...patients.map((p) => ({ value: p.id, label: p.full_name }))]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Fecha"     type="date" value={newApp.date}     onChange={setA('date')} />
          <Input label="Hora"      type="time" value={newApp.time}     onChange={setA('time')} />
          <Input label="Duración"  as="select" value={newApp.duration} onChange={setA('duration')} options={['30 min','45 min','50 min','60 min','90 min']} />
          <Input label="Modalidad" as="select" value={newApp.modality} onChange={setA('modality')} options={['Online','Presencial']} />
        </div>
        <Input label="Estado" as="select" value={newApp.status} onChange={setA('status')}
          options={[{value:'confirmado',label:'Confirmado'},{value:'a_confirmar',label:'A confirmar'},{value:'canceló',label:'Canceló'},{value:'reagendar',label:'Reagendar'},{value:'baja',label:'Baja'}]} />
        <Input label="Notas" as="textarea" rows={2} value={newApp.notes} onChange={setA('notes')} placeholder="Observaciones..." />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="dark"    onClick={addApp}>Guardar Cita</Button>
        </div>
      </Modal>
    </div>
  )
}
