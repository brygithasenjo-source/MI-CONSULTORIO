/**
 * Dashboard.jsx  —  "Gestión de Pacientes"
 * Main patient list with search, filters, stats, and patient cards.
 *
 * Phase 1: data from store (useState demo).
 * Phase 4: replace store.patients with usePatients() hook (Supabase).
 */
import { useState } from 'react'
import StatCard       from '@/components/ui/StatCard.jsx'
import EmptyState     from '@/components/ui/EmptyState.jsx'
import Button         from '@/components/ui/Button.jsx'
import PatientCard    from '@/features/patients/PatientCard.jsx'
import NewPatientModal from '@/features/patients/NewPatientModal.jsx'

const FILTERS = [
  { value: 'active', label: 'Activos'   },
  { value: 'all',    label: 'Todos'     },
  { value: 'pause',  label: 'En Pausa'  },
]

export default function Dashboard({ store, onSelectPatient }) {
  const { patients, setPatients, sessions, calcHCPct } = store

  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('active')
  const [showModal, setShowModal] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  // ── Stats ────────────────────────────────────────────────────
  const now      = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const sessionsMonth  = sessions.filter((s) => s.date?.startsWith(yearMonth) && s.status === 'realizada').length
  const canceledMonth  = sessions.filter((s) => s.date?.startsWith(yearMonth) && s.session_type === 'Cancelada').length
  const activeCount    = patients.filter((p) => p.status === 'active').length
  const incompleteHC   = patients.filter((p) => calcHCPct(p.id) < 50).length

  // ── Filtered list ────────────────────────────────────────────
  const filtered = patients.filter((p) => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'active' ? p.status === 'active' :
                            p.status === 'pause'
    return matchSearch && matchFilter
  })

  // ── Add patient ──────────────────────────────────────────────
  const handleAddPatient = (data) => {
    setPatients((prev) => [data, ...prev])
  }

  return (
    <div
      className="fade-in page-pad"
      style={{ padding: '24px 28px', maxWidth: '1100px', margin: '0 auto' }}
    >

      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Gestión de Pacientes</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '3px', fontSize: '13px' }}>
          Organiza y realiza seguimiento de tus casos clínicos
        </p>
      </div>

      {/* AI Banner */}
      {showBanner && (
        <div
          style={{
            background: 'var(--lila)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            borderLeft: '4px solid var(--lila-text)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: '9px',
                background: 'var(--lila-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '17px',
              }}
            >
              ✨
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--lila-text)' }}>
                Nuevo: Copiloto Clínico con IA
              </p>
              <p style={{ fontSize: '12px', color: 'var(--lila-text)', opacity: 0.8 }}>
                Estructura tus notas, genera conceptualizaciones de caso y objetivos terapéuticos
                con inteligencia artificial. Pruébalo desde la ficha de cualquier paciente.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '18px', color: 'var(--lila-text)', flexShrink: 0, lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search + new button */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <span
            style={{
              position: 'absolute', left: '10px', top: '50%',
              transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--text-muted)',
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente por nombre..."
            style={{
              width: '100%', padding: '9px 10px 9px 34px',
              borderRadius: '10px', border: '1px solid var(--border)',
              fontSize: '13px', outline: 'none', fontFamily: 'var(--font)',
            }}
          />
        </div>
        <Button variant="dark" onClick={() => setShowModal(true)}>
          + Nuevo Paciente
        </Button>
      </div>

      {/* Filter tabs + sort */}
      <div
        style={{
          display: 'flex', gap: '5px', marginBottom: '20px',
          flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '5px' }}>
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              style={{
                padding: '6px 14px', borderRadius: '8px',
                border: `1px solid ${filter === value ? 'var(--green-dark)' : 'var(--border)'}`,
                background: filter === value ? 'var(--green-dark)' : 'var(--white)',
                color: filter === value ? 'var(--white)' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                fontFamily: 'var(--font)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          style={{
            padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)',
            fontSize: '12px', background: 'var(--white)', color: 'var(--text-muted)',
            fontFamily: 'var(--font)', cursor: 'pointer',
          }}
        >
          <option>Más recientes primero</option>
          <option>Nombre A-Z</option>
        </select>
      </div>

      {/* Stats row */}
      <div
        className="grid-5"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="Sesiones realizadas"    value={sessionsMonth} sub="Este mes"         color="var(--green)"     icon="✅" />
        <StatCard label="Canceladas"             value={canceledMonth} sub="Este mes"         color="var(--orange)"    icon="🚫" />
        <StatCard label="Pacientes activos"      value={activeCount}   sub="Total activos"    color="var(--green-dark)" icon="👥" />
        <StatCard label="Sin sesión esta semana" value={0}             sub="Sin contacto"     color="var(--orange)"    icon="⏰" />
        <StatCard label="HCs incompletas"        value={incompleteHC}  sub="Menos del 50%"   color="var(--red)"       icon="📋" />
      </div>

      {/* Patient grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No hay pacientes"
          description={
            search
              ? `Sin resultados para "${search}"`
              : 'Agrega tu primer paciente para comenzar.'
          }
          action={
            !search && (
              <Button variant="dark" onClick={() => setShowModal(true)}>
                + Nuevo Paciente
              </Button>
            )
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
          }}
        >
          {filtered.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              hcPct={calcHCPct(p.id)}
              onClick={() => onSelectPatient(p.id)}
            />
          ))}
        </div>
      )}

      {/* New patient modal */}
      <NewPatientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddPatient}
      />
    </div>
  )
}
