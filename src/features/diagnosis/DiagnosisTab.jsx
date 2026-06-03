/**
 * DiagnosisTab.jsx
 * Diagnosis, severity, risk, therapeutic goals and intervention plan.
 */
import { useState } from 'react'
import Button from '@/components/ui/Button.jsx'
import Input  from '@/components/ui/Input.jsx'

async function callGemini(prompt) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) return '⚠️ Configura VITE_GEMINI_API_KEY en tu .env'
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: 'Eres psicólogo clínico experto. Responde en español.' }] },
        }),
      }
    )
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.'
  } catch {
    return 'Error al conectar con el Copiloto Clínico.'
  }
}

const SEVERITY_OPTS = ['Leve', 'Moderado', 'Severo']
const RISK_OPTS     = ['Sin riesgo', 'Riesgo bajo', 'Riesgo alto']

export default function DiagnosisTab({ patient, history, setClinicalHistories }) {
  const h = history ?? {}
  const [form,      setForm]      = useState({ diagnosis: h.diagnosis ?? '', therapeutic_goals: h.therapeutic_goals ?? '', intervention_plan: h.intervention_plan ?? '' })
  const [severity,  setSeverity]  = useState('Moderado')
  const [risk,      setRisk]      = useState('Sin riesgo')
  const [criteria,  setCriteria]  = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [wasSaved,  setWasSaved]  = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const generateGoals = async () => {
    setAiLoading(true)
    const result = await callGemini(
      `Genera 5-6 objetivos terapéuticos concretos y medibles para:\n` +
      `Paciente: ${patient.full_name}, ${patient.age} años.\n` +
      `Motivo de consulta: "${h.explicit_reason ?? 'No especificado'}"\n` +
      `Lista numerada, cada objetivo en 1-2 líneas.`
    )
    setForm((f) => ({ ...f, therapeutic_goals: result }))
    setAiLoading(false)
  }

  const handleSave = () => {
    setClinicalHistories((prev) => ({
      ...prev,
      [patient.id]: { ...(prev[patient.id] ?? {}), ...form },
    }))
    setWasSaved(true)
    setTimeout(() => setWasSaved(false), 2500)
  }

  const riskColor = (v) => v === 'Riesgo alto' ? 'var(--red)' : 'var(--green)'
  const isRiskActive = (v) => risk === v

  return (
    <div>
      {/* Ethical notice */}
      <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px', padding: '11px 15px', marginBottom: '18px', display: 'flex', gap: '9px' }}>
        <span style={{ fontSize: '17px', flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: '12px', color: '#92400E' }}>
          <strong>Nota ética:</strong> Esta herramienta no reemplaza el criterio profesional. Toda información generada debe ser revisada y validada por el especialista. El diagnóstico debe basarse en manuales oficiales (DSM-5 / CIE-11).
        </p>
      </div>

      <div className="diag-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '4px' }}>
        <Input label="Diagnóstico principal (DSM-5 / CIE-11)"
          value={form.diagnosis} onChange={set('diagnosis')}
          placeholder="Ej. F41.1 Trastorno de ansiedad generalizada" />
        <Input label="Diagnósticos diferenciales"
          placeholder="Ej. F32.1 Episodio depresivo moderado" />
      </div>

      {/* Severity selector */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>
          Nivel de severidad
        </label>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {SEVERITY_OPTS.map((v) => (
            <button key={v} onClick={() => setSeverity(v)}
              style={{
                padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--font)',
                border: `1px solid ${severity === v ? 'var(--green)' : 'var(--border)'}`,
                background: severity === v ? 'var(--green-mint)' : 'var(--white)',
                fontWeight: severity === v ? 700 : 400, fontSize: '13px',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Risk selector */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>
          Nivel de riesgo
        </label>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {RISK_OPTS.map((v) => (
            <button key={v} onClick={() => setRisk(v)}
              style={{
                padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--font)',
                border: `1px solid ${isRiskActive(v) ? riskColor(v) : 'var(--border)'}`,
                background: isRiskActive(v) ? (v === 'Riesgo alto' ? '#FEE2E2' : 'var(--green-mint)') : 'var(--white)',
                fontWeight: isRiskActive(v) ? 700 : 400, fontSize: '13px',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <Input label="Criterios observados" as="textarea" rows={3}
        value={criteria} onChange={(e) => setCriteria(e.target.value)}
        placeholder="Criterios DSM-5/CIE-11 observados en la evaluación..." />

      {/* Therapeutic goals with AI */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Objetivos terapéuticos
        </label>
        <Button variant="ai" size="sm" onClick={generateGoals} disabled={aiLoading}>
          {aiLoading ? '⏳ Generando...' : '✨ Generar con IA'}
        </Button>
      </div>
      <Input as="textarea" rows={4}
        value={form.therapeutic_goals} onChange={set('therapeutic_goals')}
        placeholder="1. Reducir niveles de ansiedad...\n2. Mejorar regulación emocional..." />

      <Input label="Plan de intervención" as="textarea" rows={4}
        value={form.intervention_plan} onChange={set('intervention_plan')}
        placeholder="Enfoque terapéutico, frecuencia, técnicas principales, duración estimada..." />

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', marginTop: '4px' }}>
        {wasSaved && <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>✅ Guardado</span>}
        <Button variant="dark" onClick={handleSave}>💾 Guardar Diagnóstico</Button>
      </div>
    </div>
  )
}
