import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Pages
import AuthView      from '@/pages/AuthView.jsx'
import Dashboard     from '@/pages/Dashboard.jsx'
import PatientProfile from '@/pages/PatientProfile.jsx'
import AgendaView    from '@/pages/AgendaView.jsx'
import FinancesView  from '@/pages/FinancesView.jsx'
import MetricsView   from '@/pages/MetricsView.jsx'
import SettingsView  from '@/pages/SettingsView.jsx'

// Layout
import Sidebar    from '@/components/layout/Sidebar.jsx'
import BottomNav  from '@/components/layout/BottomNav.jsx'

// Data (demo — Phase 1)
import { DEMO_PATIENTS, DEMO_SESSIONS, DEMO_PAYMENTS, DEMO_APPOINTMENTS, DEMO_REMINDERS, DEMO_CLINICAL_HISTORIES } from '@/data/demoData.js'

// ─── PHASE 2+ : replace with useAuth() hook + Supabase ───────
// import { useAuth } from '@/hooks/useAuth.js'

/**
 * AppShell — the authenticated wrapper with sidebar/bottom-nav.
 * Receives shared state as props (Phase 1 = useState demo).
 * Phase 4+: each page fetches its own data via custom hooks.
 */
function AppShell({ user, onLogout, store }) {
  const navigate = useNavigate()

  const handleSelectPatient = (id) => {
    store.setSelectedPatientId(id)
    navigate(`/paciente/${id}`)
  }

  const handleBack = () => {
    store.setSelectedPatientId(null)
    navigate('/')
  }

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                store={store}
                onSelectPatient={handleSelectPatient}
              />
            }
          />
          <Route
            path="/paciente/:id"
            element={
              <PatientProfile
                store={store}
                onBack={handleBack}
              />
            }
          />
          <Route path="/agenda"    element={<AgendaView    store={store} />} />
          <Route path="/finanzas"  element={<FinancesView  store={store} />} />
          <Route path="/metricas"  element={<MetricsView   store={store} />} />
          <Route path="/configuracion" element={<SettingsView user={user} />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}

/**
 * App — root component.
 *
 * Phase 1: demo data in useState.
 * Phase 2: replace `user` / `setUser` with Supabase Auth.
 * Phase 4: replace store arrays with Supabase query hooks.
 */
export default function App() {
  // ── Auth state (Phase 1 = simple object; Phase 2 = Supabase session) ──
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  // ── Demo data store (Phase 1 only) ───────────────────────────────────
  // Phase 4: remove all of this and use per-page Supabase hooks instead.
  const [patients,           setPatients]           = useState(DEMO_PATIENTS)
  const [sessions,           setSessions]           = useState(DEMO_SESSIONS)
  const [payments,           setPayments]           = useState(DEMO_PAYMENTS)
  const [appointments,       setAppointments]       = useState(DEMO_APPOINTMENTS)
  const [reminders,          setReminders]          = useState(DEMO_REMINDERS)
  const [clinicalHistories,  setClinicalHistories]  = useState(DEMO_CLINICAL_HISTORIES)
  const [selectedPatientId,  setSelectedPatientId]  = useState(null)

  // HC completion % — counts filled mandatory fields
  const calcHCPct = (patientId) => {
    const h = clinicalHistories[patientId]
    if (!h) return 0
    const mandatory = [
      'explicit_reason', 'implicit_reason', 'main_symptoms',
      'civil_status', 'childhood', 'family_structure',
      'initial_clinical_evaluation', 'diagnosis',
    ]
    const filled = mandatory.filter(f => h[f]?.trim?.()).length
    return Math.round((filled / mandatory.length) * 100)
  }

  const store = {
    patients,           setPatients,
    sessions,           setSessions,
    payments,           setPayments,
    appointments,       setAppointments,
    reminders,          setReminders,
    clinicalHistories,  setClinicalHistories,
    selectedPatientId,  setSelectedPatientId,
    calcHCPct,
  }

  // ── Phase 2: uncomment and remove the simple login below ────────────
  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null)
  //     setAuthLoading(false)
  //   })
  //   return () => subscription.unsubscribe()
  // }, [])

  const handleLogin  = (userData) => setUser(userData)
  const handleLogout = () => { setUser(null) }

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!user) {
    return <AuthView onLogin={handleLogin} />
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      store={store}
    />
  )
}
