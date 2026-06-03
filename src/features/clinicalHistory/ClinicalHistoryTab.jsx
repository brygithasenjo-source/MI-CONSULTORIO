/**
 * ClinicalHistoryTab.jsx
 * Grid of editable cards matching reference image 1 exactly.
 * Each section has an "Editar" button that reveals inline textarea fields.
 */
import { useState } from 'react'
import Card   from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'

// All HC sections with their fields
const SECTIONS = [
  {
    id: 'motivo', title: '💬 Motivo de Consulta',
    fields: [
      { key: 'explicit_reason',  label: 'MOTIVO EXPLÍCITO (EN PALABRAS DEL PACIENTE)' },
      { key: 'implicit_reason',  label: 'MOTIVO IMPLÍCITO / LECTURA CLÍNICA' },
      { key: 'main_symptoms',    label: 'SÍNTOMAS PRINCIPALES' },
      { key: 'evolution_time',   label: 'TIEMPO DE EVOLUCIÓN' },
    ],
  },
  {
    id: 'historia_personal', title: '📖 Historia Personal',
    fields: [
      { key: 'childhood',            label: 'INFANCIA Y DESARROLLO' },
      { key: 'adolescence',          label: 'ADOLESCENCIA' },
      { key: 'relationship_history', label: 'HISTORIA VINCULAR / AMOROSA' },
      { key: 'work_history',         label: 'HISTORIA LABORAL' },
      { key: 'significant_events',   label: 'EVENTOS VITALES SIGNIFICATIVOS / TRAUMAS' },
    ],
  },
  {
    id: 'datos_personales', title: '👤 Datos Personales Relevantes',
    fields: [
      { key: 'civil_status',     label: 'ESTADO CIVIL / VÍNCULOS' },
      { key: 'occupation',       label: 'OCUPACIÓN / SITUACIÓN LABORAL' },
      { key: 'education_level',  label: 'NIVEL EDUCATIVO' },
      { key: 'living_situation', label: 'CONVIVENCIA' },
    ],
  },
  {
    id: 'historia_familiar', title: '👨‍👩‍👧 Historia Familiar',
    fields: [
      { key: 'family_structure',                  label: 'ESTRUCTURA FAMILIAR DE ORIGEN' },
      { key: 'family_dynamics',                   label: 'DINÁMICAS RELEVANTES / VÍNCULOS PARENTALES' },
      { key: 'family_psychopathological_history', label: 'ANTECEDENTES PSICOPATOLÓGICOS FAMILIARES' },
    ],
  },
  {
    id: 'evaluacion', title: '🔬 Evaluación Clínica Inicial',
    fields: [
      { key: 'initial_clinical_evaluation', label: 'PRESENTACIÓN GENERAL' },
      { key: 'tests_administered',          label: 'ESCALAS / INSTRUMENTOS ADMINISTRADOS' },
    ],
  },
  {
    id: 'antecedentes', title: '📋 Antecedentes',
    fields: [
      { key: 'previous_psychological_treatments', label: 'TRATAMIENTOS PSICOLÓGICOS ANTERIORES' },
      { key: 'previous_psychiatric_treatments',   label: 'TRATAMIENTOS PSIQUIÁTRICOS / MEDICACIÓN' },
      { key: 'medication',                        label: 'MEDICACIÓN ACTUAL' },
    ],
  },
]

export default function ClinicalHistoryTab({ patient, history, setClinicalHistories }) {
  const [editSection, setEditSection] = useState(null) // section id currently being edited
  const [draft,       setDraft]       = useState({})

  const h = history ?? {}

  const startEdit = (sectionId, fields) => {
    const d = {}
    fields.forEach((f) => { d[f.key] = h[f.key] ?? '' })
    setDraft(d)
    setEditSection(sectionId)
  }

  const cancelEdit = () => { setEditSection(null); setDraft({}) }

  const saveSection = () => {
    setClinicalHistories((prev) => ({
      ...prev,
      [patient.id]: { ...(prev[patient.id] ?? {}), ...draft, updated_at: new Date().toISOString() },
    }))
    setEditSection(null)
    setDraft({})
  }

  return (
    <div
      className="hc-grid"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
    >
      {SECTIONS.map((sec) => {
        const isEditing = editSection === sec.id
        return (
          <Card key={sec.id} style={{ padding: '18px' }}>
            {/* Section header — matches reference image exactly */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 700 }}>{sec.title}</h3>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button variant="ghost"   size="sm" onClick={cancelEdit}>Cancelar</Button>
                  <Button variant="dark"    size="sm" onClick={saveSection}>Guardar</Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => startEdit(sec.id, sec.fields)}>
                  Editar
                </Button>
              )}
            </div>

            {/* Fields — each label in UPPERCASE caps, value italic if empty */}
            {sec.fields.map((f) => (
              <div key={f.key} style={{ marginBottom: '12px' }}>
                <p
                  style={{
                    fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)',
                    letterSpacing: '0.5px', marginBottom: '4px',
                  }}
                >
                  {f.label}
                </p>

                {isEditing ? (
                  <textarea
                    value={draft[f.key] ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    rows={2}
                    style={{
                      width: '100%', padding: '7px 10px', borderRadius: '8px',
                      border: '1px solid var(--green)', fontSize: '13px',
                      resize: 'vertical', fontFamily: 'var(--font)',
                    }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: '13px',
                      color: h[f.key] ? 'var(--text)' : 'var(--text-muted)',
                      fontStyle: h[f.key] ? 'normal' : 'italic',
                    }}
                  >
                    {h[f.key] || 'Sin completar'}
                  </p>
                )}
              </div>
            ))}
          </Card>
        )
      })}
    </div>
  )
}
