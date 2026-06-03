/**
 * SessionsTab.jsx
 * Full session management: form + history list.
 * Matches reference design (imagen 4) exactly.
 *
 * Phase 1: mutations go to store setState.
 * Phase 4: replace with sessionService.create / update / delete.
 */
import { useState } from 'react'
import Card       from '@/components/ui/Card.jsx'
import Button     from '@/components/ui/Button.jsx'
import Input      from '@/components/ui/Input.jsx'
import Badge      from '@/components/ui/Badge.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'

// ── Gemini call (Phase 5: move to geminiService.js + proxy) ──
async function callGemini(prompt) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) return '⚠️ Configura VITE_GEMINI_API_KEY en tu .env para usar el Copiloto Clínico.'
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: 'Eres un asistente clínico experto para psicólogos. Responde siempre en español. Sé conciso y clínicamente preciso.' }],
          },
        }),
      }
    )
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.'
  } catch {
    return 'Error al conectar con el Copiloto Clínico. Verifica tu API key y conexión.'
  }
}

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  duration: '50 min', modality: 'Online',
  session_type: 'Realizada', emotional_state_start: '',
  main_topic: '', raw_notes: '', structured_notes: '',
  topics_worked: '', interventions_used: '',
  homework: '', clinical_observations: '', status: 'realizada',
}

const EMOT_STATES = ['😔 Bajo', '😰 Ansioso/a', '😐 Neutro', '🙂 Estable', '😊 Bien']

export default function SessionsTab({ patient, sessions, setSessions, payments }) {
  const [showForm,    setShowForm]    = useState(false)
  const [form,        setForm]        = useState({ ...EMPTY_FORM, modality: patient.modality ?? 'Online' })
  const [editId,      setEditId]      = useState(null)
  const [expandedId,  setExpandedId]  = useState(null)
  const [aiLoading,   setAiLoading]   = useState(false)
  const [aiField,     setAiField]     = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setVal = (field, val) => setForm((f) => ({ ...f, [field]: val }))

  // Stats
  const done       = sessions.filter((s) => s.status === 'realizada').length
  const canceled   = sessions.filter((s) => s.session_type === 'Cancelada').length
  const totalPaid  = payments.filter((p) => p.status === 'pagado').reduce((a, p) => a + Number(p.amount), 0)

  // ── AI helpers ──────────────────────────────────────────────
  const runAI = async (action) => {
    setAiLoading(true); setAiField(action)
    let result = ''
    if (action === 'structure') {
      result = await callGemini(
        `Estructura estas notas clínicas en formato SOAP para el paciente ${patient.full_name}:\n\n"${form.raw_notes || form.structured_notes}"\n\nFormato exacto:\nS (Subjetivo): ...\nO (Objetivo): ...\nA (Apreciación): ...\nP (Plan): ...`
      )
      setVal('structured_notes', result)
    }
    if (action === 'interventions') {
      result = await callGemini(
        `Sugiere 3-5 intervenciones terapéuticas para:\nTema: "${form.main_topic}"\nEstado emocional: "${form.emotional_state_start}"\nSé específico, basado en evidencia (TCC, ACT, DBT).`
      )
      setVal('interventions_used', result)
    }
    if (action === 'homework') {
      result = await callGemini(
        `Genera una tarea terapéutica para casa:\nTema sesión: "${form.main_topic}"\nIntervenciones usadas: "${form.interventions_used}"\nDebe ser concreta, motivadora y apropiada.`
      )
      setVal('homework', result)
    }
    setAiLoading(false); setAiField('')
  }

  // ── CRUD ────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.main_topic.trim() && !form.raw_notes.trim()) {
      alert('Completa al menos el Tema principal o las Notas de sesión.')
      return
    }
    if (editId) {
      setSessions((prev) => prev.map((s) => s.id === editId ? { ...s, ...form } : s))
      setEditId(null)
    } else {
      setSessions((prev) => [
        { ...form, id: `s${Date.now()}`, patient_id: patient.id, user_id: 'demo-user', created_at: new Date().toISOString() },
        ...prev,
      ])
    }
    setForm({ ...EMPTY_FORM, modality: patient.modality ?? 'Online' })
    setShowForm(false)
  }

  const handleEdit = (s) => {
    setForm({ ...s })
    setEditId(s.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar esta sesión?')) {
      setSessions((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM, modality: patient.modality ?? 'Online' })
    setEditId(null)
    setShowForm(false)
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div>
      {/* Summary stats */}
      <div className="session-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <Card style={{ padding: '12px 14px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sesiones realizadas</p>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--green-dark)' }}>{done}</p>
        </Card>
        <Card style={{ padding: '12px 14px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cancelaciones</p>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--orange)' }}>{canceled}</p>
        </Card>
        <Card style={{ padding: '12px 14px', background: 'var(--green-dark)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Total abonado</p>
          <p style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>S/.{totalPaid}</p>
        </Card>
      </div>

      {/* Toggle form button */}
      {!showForm && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button variant="dark" onClick={() => setShowForm(true)}>+ Registrar Sesión</Button>
        </div>
      )}

      {/* Session form — matches reference image 4 */}
      {showForm && (
        <Card style={{ marginBottom: '24px', border: '1px solid rgba(66,184,131,0.25)', overflow: 'hidden' }}>
          {/* Form header */}
          <div style={{ background: 'var(--bg)', padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🗒</span>
              <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                {editId ? 'Editar sesión' : 'Registrar sesión'}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <Button variant="ghost" size="sm" onClick={handleCancel}>✕</Button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Row 1: fecha, duración, modalidad */}
            <div className="session-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <Input label="Fecha"     type="date"  value={form.date}     onChange={set('date')} />
              <Input label="Duración"  as="select"  value={form.duration} onChange={set('duration')}
                options={['30 min', '45 min', '50 min', '60 min', '90 min']} />
              <Input label="Modalidad" as="select"  value={form.modality} onChange={set('modality')}
                options={['Online', 'Presencial']} />
            </div>

            {/* Tipo de sesión */}
            <Input label="Tipo de sesión" as="select" value={form.session_type} onChange={set('session_type')}
              options={['Realizada', 'Cancelada', 'Reprogramada', 'Evaluación inicial', 'Sesión de cierre']} />

            {/* Estado emocional */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Estado emocional del paciente al inicio
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOT_STATES.map((e) => (
                  <button
                    key={e}
                    onClick={() => setVal('emotional_state_start', e)}
                    style={{
                      padding: '6px 13px', borderRadius: '20px',
                      border: `1px solid ${form.emotional_state_start === e ? 'var(--green)' : 'var(--border)'}`,
                      background: form.emotional_state_start === e ? 'var(--green-mint)' : 'var(--white)',
                      fontSize: '13px', cursor: 'pointer',
                      fontWeight: form.emotional_state_start === e ? 700 : 400,
                      fontFamily: 'var(--font)',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Tema principal */}
            <Input label="Tema principal" value={form.main_topic} onChange={set('main_topic')}
              placeholder="Ej. Ansiedad laboral, conflicto de pareja..." />

            {/* Notas + botones IA */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Notas de sesión
              </label>
              <textarea
                value={form.raw_notes}
                onChange={set('raw_notes')}
                placeholder="Escribí tus notas de la sesión y luego podés estructurarlas con IA..."
                rows={5}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px', resize: 'vertical', fontFamily: 'var(--font)' }}
              />
              {/* AI action buttons — exact match to reference */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                <Button variant="ai" size="sm" onClick={() => runAI('structure')}
                  disabled={aiLoading && aiField === 'structure'}>
                  {aiLoading && aiField === 'structure' ? '⏳ Procesando...' : '✨ Estructurar con IA'}
                </Button>
                <Button size="sm"
                  style={{ background: '#FFF7ED', color: '#92400E', border: '1px solid #FED7AA' }}
                  onClick={() => alert('📸 Transcribir foto\n\nFunción preparada para Fase 5.\nPermitirá fotografiar notas escritas a mano y transcribirlas con IA.')}>
                  📸 Transcribir foto
                </Button>
                <Button size="sm"
                  style={{ background: '#FFF7ED', color: '#92400E', border: '1px solid #FED7AA' }}
                  onClick={() => alert('🎙 Subir audio\n\nFunción preparada para Fase 5.\nPermitirá subir un audio de la sesión y convertirlo a texto estructurado con Whisper AI.')}>
                  🎙 Subir audio
                </Button>
                <Button size="sm"
                  style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                  onClick={() => alert('🔴 Grabar\n\nFunción preparada para Fase 5.\nPermitirá grabar directamente desde el navegador y transcribir en tiempo real.')}>
                  🔴 Grabar
                </Button>
              </div>
            </div>

            {/* Notas SOAP estructuradas */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Notas clínicas SOAP {form.structured_notes && <Badge color="purple" style={{ marginLeft: '6px' }}>IA</Badge>}
              </label>
              <textarea
                value={form.structured_notes}
                onChange={set('structured_notes')}
                placeholder={'S (Subjetivo): ...\nO (Objetivo): ...\nA (Apreciación): ...\nP (Plan): ...'}
                rows={6}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px', resize: 'vertical', fontFamily: 'var(--font)' }}
              />
            </div>

            {/* Temas trabajados + intervenciones */}
            <div className="session-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '4px' }}>
              <Input label="Temas trabajados en sesión" as="textarea" rows={3}
                value={form.topics_worked} onChange={set('topics_worked')}
                placeholder="Ej. Regulación emocional, reestructuración cognitiva..." />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Intervenciones utilizadas
                  </label>
                  <Button variant="ai" size="sm" onClick={() => runAI('interventions')}
                    disabled={aiLoading}>
                    {aiLoading && aiField === 'interventions' ? '⏳' : '✨ Sugerir'}
                  </Button>
                </div>
                <Input as="textarea" rows={3} value={form.interventions_used} onChange={set('interventions_used')}
                  placeholder="Ej. Reestructuración cognitiva, psicoeducación..." />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tarea para la próxima sesión
                  </label>
                  <Button variant="ai" size="sm" onClick={() => runAI('homework')}
                    disabled={aiLoading}>
                    {aiLoading && aiField === 'homework' ? '⏳' : '✨ Generar'}
                  </Button>
                </div>
                <Input as="textarea" rows={3} value={form.homework} onChange={set('homework')}
                  placeholder="Ej. Registro de pensamientos automáticos..." />
              </div>

              <Input label="Notas clínicas / Observaciones" as="textarea" rows={3}
                value={form.clinical_observations} onChange={set('clinical_observations')}
                placeholder="Observaciones clínicas relevantes..." />
            </div>

            {/* Archivos adjuntos */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Archivos adjuntos
              </label>
              <Button variant="outline" size="sm"
                onClick={() => alert('📎 Adjuntar archivo\n\nFase 5: Supabase Storage.\nPodrás subir informes, tests y formularios vinculados a esta sesión.')}>
                📎 Adjuntar archivo
              </Button>
            </div>

            {/* Form actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button variant="dark"    onClick={handleSave}>💾 Guardar Sesión</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Session history */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
          🗂 Historial de Sesiones ({sessions.length})
        </h3>

        {sessions.length === 0 ? (
          <EmptyState
            icon="🗒"
            title="Sin sesiones registradas"
            description="Registra la primera sesión usando el botón de arriba."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                onEdit={() => handleEdit(s)}
                onDelete={() => handleDelete(s.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── SessionCard sub-component ────────────────────────────────
function SessionCard({ session: s, expanded, onToggle, onEdit, onDelete }) {
  const borderColor = s.session_type === 'Cancelada' ? 'var(--red)' : 'var(--green)'
  const dateStr = s.date
    ? new Date(s.date + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <Card style={{ borderLeft: `3px solid ${borderColor}` }}>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
              <p style={{ fontWeight: 700, fontSize: '13px' }}>{dateStr}</p>
              <Badge color={s.session_type === 'Cancelada' ? 'red' : 'green'}>
                {s.session_type ?? 'Realizada'}
              </Badge>
              {s.emotional_state_start && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {s.emotional_state_start}
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green-dark)' }}>
              {s.main_topic}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
            <Button variant="outline" size="sm" onClick={onEdit}>✏️ Editar</Button>
            <Button variant="danger"  size="sm" onClick={onDelete}>🗑</Button>
          </div>
        </div>

        <button
          onClick={onToggle}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--green)', fontWeight: 600, marginTop: '6px', padding: 0, fontFamily: 'var(--font)' }}
        >
          {expanded ? '▲ Ver menos' : '▼ Ver detalle'}
        </button>
      </div>

      {expanded && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
          {(s.topics_worked || s.interventions_used) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px', marginTop: '10px' }}>
              {s.topics_worked && (
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Temas trabajados</p>
                  <p style={{ fontSize: '13px' }}>{s.topics_worked}</p>
                </div>
              )}
              {s.interventions_used && (
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Intervenciones</p>
                  <p style={{ fontSize: '13px' }}>{s.interventions_used}</p>
                </div>
              )}
            </div>
          )}
          {s.structured_notes && (
            <div style={{ marginTop: '10px', padding: '12px', background: 'var(--lila)', borderRadius: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--lila-text)', marginBottom: '6px' }}>✨ Notas SOAP</p>
              <p style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>{s.structured_notes}</p>
            </div>
          )}
          {s.homework && (
            <div style={{ marginTop: '10px', padding: '12px', background: '#FFF7ED', borderRadius: '8px', border: '1px solid #FED7AA' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#92400E', marginBottom: '6px' }}>📝 Tarea</p>
              <p style={{ fontSize: '13px', color: 'var(--text)' }}>{s.homework}</p>
            </div>
          )}
          {s.clinical_observations && (
            <div style={{ marginTop: '10px', padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Observaciones</p>
              <p style={{ fontSize: '13px' }}>{s.clinical_observations}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
