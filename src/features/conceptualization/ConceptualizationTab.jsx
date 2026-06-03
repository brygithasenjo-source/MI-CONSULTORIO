/**
 * ConceptualizationTab.jsx
 * AI-powered case conceptualization generator.
 */
import { useState } from 'react'
import Card   from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import Badge  from '@/components/ui/Badge.jsx'

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
          systemInstruction: { parts: [{ text: 'Eres un psicólogo clínico experto. Responde siempre en español. Sé conciso y clínicamente preciso.' }] },
        }),
      }
    )
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.'
  } catch {
    return 'Error al conectar con el Copiloto Clínico.'
  }
}

const CONCEPT_FIELDS = [
  { key: 'main_problem',          label: 'Problema principal',      placeholder: 'Descripción del problema central...' },
  { key: 'predisposing_factors',  label: 'Factores predisponentes', placeholder: 'Historia de aprendizaje, biología...' },
  { key: 'precipitating_factors', label: 'Factores precipitantes',  placeholder: 'Eventos o situaciones desencadenantes...' },
  { key: 'maintaining_factors',   label: 'Factores mantenedores',   placeholder: 'Qué mantiene el problema actual...' },
  { key: 'personal_resources',    label: 'Recursos personales',     placeholder: 'Fortalezas y recursos del paciente...' },
  { key: 'clinical_hypothesis',   label: 'Hipótesis clínica',       placeholder: 'Hipótesis principal del caso...' },
]

export default function ConceptualizationTab({ patient, sessions, history, setClinicalHistories }) {
  const saved = history?.case_conceptualization ?? ''
  const [text,    setText]    = useState(saved)
  const [fields,  setFields]  = useState({})
  const [loading, setLoading] = useState(false)
  const [wasSaved, setWasSaved] = useState(false)

  const generate = async () => {
    setLoading(true)
    const sessionsSummary = sessions
      .slice(0, 10)
      .map((s) => s.main_topic || s.structured_notes || '')
      .filter(Boolean)
      .join('; ')

    const result = await callGemini(
      `Genera una conceptualización de caso clínico para:\n` +
      `Paciente: ${patient.full_name}, ${patient.age} años\n` +
      `Motivo de consulta: ${history?.explicit_reason ?? 'No especificado'}\n` +
      `Sesiones trabajadas: ${sessionsSummary}\n\n` +
      `Incluye:\n` +
      `1. Hipótesis de mantenimiento\n` +
      `2. Factores predisponentes\n` +
      `3. Factores precipitantes\n` +
      `4. Factores de protección\n` +
      `5. Ciclo del problema\n` +
      `6. Intervenciones sugeridas`
    )
    setText(result)
    setLoading(false)
  }

  const handleSave = () => {
    setClinicalHistories((prev) => ({
      ...prev,
      [patient.id]: { ...(prev[patient.id] ?? {}), case_conceptualization: text },
    }))
    setWasSaved(true)
    setTimeout(() => setWasSaved(false), 2500)
  }

  return (
    <div>
      {/* AI panel */}
      <div
        style={{
          background: 'var(--lila)', borderRadius: '12px', padding: '18px',
          marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: '11px', background: 'var(--lila-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>
          ✨
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lila-text)', marginBottom: '5px' }}>
            IA: Conceptualización de Caso
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--lila-text)', opacity: 0.8, marginBottom: '12px' }}>
            Analiza las {sessions.length} sesiones y la historia clínica para generar un borrador clínico.
            Revisa y edita antes de guardar.
          </p>
          <Button variant="ai" onClick={generate} disabled={loading || sessions.length === 0}>
            {loading ? '⏳ Analizando caso...' : '✨ Generar conceptualización'}
          </Button>
          {sessions.length === 0 && (
            <p style={{ fontSize: '12px', color: 'var(--lila-text)', opacity: 0.7, marginTop: '8px' }}>
              Registra al menos una sesión para usar esta función.
            </p>
          )}
        </div>
      </div>

      {/* Structured mini-fields */}
      <div
        className="concept-2col"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}
      >
        {CONCEPT_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
              {label}
            </label>
            <textarea
              value={fields[key] ?? ''}
              onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              rows={3}
              style={{ width: '100%', padding: '8px 11px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px', resize: 'vertical', fontFamily: 'var(--font)' }}
            />
          </div>
        ))}
      </div>

      {/* Full conceptualization textarea */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '7px' }}>
          Conceptualización completa del caso
          {text && <Badge color="purple">IA</Badge>}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={loading ? 'Generando...' : 'La IA escribirá aquí. También puedes escribir directamente.'}
          rows={10}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: '10px',
            border: '1px solid var(--border)', fontSize: '13px', resize: 'vertical',
            fontFamily: 'var(--font)', background: loading ? 'var(--bg)' : 'var(--white)',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {wasSaved && <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>✅ Guardado</span>}
        <Button variant="dark" onClick={handleSave}>💾 Guardar conceptualización</Button>
      </div>
    </div>
  )
}
