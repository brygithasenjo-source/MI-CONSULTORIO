/**
 * PatientProfile.jsx
 * Full patient detail view with sidebar + tabbed content.
 * Matches reference images 1 and 4 exactly.
 *
 * Phase 1: reads/writes from store (useState).
 * Phase 4: each tab's mutations go to Supabase services.
 */
import { useParams } from 'react-router-dom'
import { useState }  from 'react'

import PatientSidebar       from '@/features/patients/PatientSidebar.jsx'
import SessionsTab          from '@/features/sessions/SessionsTab.jsx'
import PaymentsTab          from '@/features/payments/PaymentsTab.jsx'
import ClinicalHistoryTab   from '@/features/clinicalHistory/ClinicalHistoryTab.jsx'
import ConceptualizationTab from '@/features/conceptualization/ConceptualizationTab.jsx'
import DiagnosisTab         from '@/features/diagnosis/DiagnosisTab.jsx'

const TABS = [
  { id: 'sesiones',          label: 'Sesiones' },
  { id: 'pagos',             label: 'Pagos' },
  { id: 'historia',          label: 'Historia Clínica' },
  { id: 'conceptualizacion', label: 'Conceptualización' },
  { id: 'diagnostico',       label: 'Diagnóstico' },
]

export default function PatientProfile({ store, onBack }) {
  const { id }  = useParams()
  const [tab, setTab] = useState('sesiones')

  const {
    patients, setPatients,
    sessions, setSessions,
    payments, setPayments,
    clinicalHistories, setClinicalHistories,
  } = store

  const patient = patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>Paciente no encontrado</p>
        <button
          onClick={onBack}
          style={{ color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'var(--font)' }}
        >
          ← Volver al listado
        </button>
      </div>
    )
  }

  const patSessions = sessions.filter((s) => s.patient_id === patient.id)
  const patPayments = payments.filter((p) => p.patient_id === patient.id)
  const patHistory  = clinicalHistories[patient.id] ?? {}

  const handleUpdate = (updated) => {
    setPatients((prev) => prev.map((p) => p.id === patient.id ? { ...p, ...updated } : p))
  }

  const handleDelete = () => {
    setPatients((prev) => prev.filter((p) => p.id !== patient.id))
    onBack()
  }

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>

      {/* AI banner — exact match to reference images */}
      <div className="ai-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'var(--lila-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px' }}>
            ✨
          </div>
          <p style={{ fontSize: '13px', color: 'var(--lila-text)', fontWeight: 600 }}>
            Nuevo: Copiloto Clínico con IA — Estructura tus notas de sesión, generá conceptualizaciones de caso y objetivos terapéuticos con inteligencia artificial. Probalo desde la ficha de cualquier paciente.
          </p>
        </div>
        <span style={{ fontSize: '18px', color: 'var(--lila-text)', cursor: 'pointer', flexShrink: 0 }}>✕</span>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font)' }}
        >
          ← Volver
        </button>
      </div>

      {/* Profile layout: sidebar + tabs */}
      <div className="profile-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '0 20px 40px' }}>

        {/* ── Left sidebar ── */}
        <div className="profile-sidebar" style={{ width: '240px', flexShrink: 0 }}>
          <PatientSidebar
            patient={patient}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Tab bar — matches reference image exactly */}
          <div className="tab-bar" style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`tab-btn${tab === t.id ? ' active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="fade-in">
            {tab === 'sesiones' && (
              <SessionsTab
                patient={patient}
                sessions={patSessions}
                setSessions={setSessions}
                payments={patPayments}
              />
            )}
            {tab === 'pagos' && (
              <PaymentsTab
                patient={patient}
                payments={patPayments}
                sessions={patSessions}
                setPayments={setPayments}
              />
            )}
            {tab === 'historia' && (
              <ClinicalHistoryTab
                patient={patient}
                history={patHistory}
                setClinicalHistories={setClinicalHistories}
              />
            )}
            {tab === 'conceptualizacion' && (
              <ConceptualizationTab
                patient={patient}
                sessions={patSessions}
                history={patHistory}
                setClinicalHistories={setClinicalHistories}
              />
            )}
            {tab === 'diagnostico' && (
              <DiagnosisTab
                patient={patient}
                history={patHistory}
                setClinicalHistories={setClinicalHistories}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
