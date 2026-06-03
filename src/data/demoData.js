/**
 * demoData.js
 *
 * Seed data used ONLY in Phase 1 (useState demo).
 * Phase 4: delete this file and replace with Supabase hooks.
 *
 * Shape matches the Supabase schema exactly so migration is a
 * straight swap: useState([]) → useSessions(patientId), etc.
 */

// ─── PATIENTS ─────────────────────────────────────────────────
export const DEMO_PATIENTS = [
  {
    id: 'p1',
    user_id: 'demo-user',
    full_name: 'María García',
    age: 29,
    email: 'maria@email.com',
    phone: '+51 987 654 321',
    modality: 'Online',
    frequency: 'Semanal',
    session_price: 120,
    status: 'active',
    start_date: '22/01/2026',
    next_session: 'Mar 3/6 - 09:00hs',
    notes: 'Deriva de médico psiquiatra',
    tags: ['ansiedad', 'laboral'],
    created_at: '2026-01-22T08:00:00Z',
  },
  {
    id: 'p2',
    user_id: 'demo-user',
    full_name: 'Carlos Mendoza',
    age: 35,
    email: 'carlos@email.com',
    phone: '+51 912 345 678',
    modality: 'Presencial',
    frequency: 'Quincenal',
    session_price: 150,
    status: 'active',
    start_date: '15/02/2026',
    next_session: 'Vie 6/6 - 11:00hs',
    notes: '',
    tags: ['depresión', 'pareja'],
    created_at: '2026-02-15T08:00:00Z',
  },
  {
    id: 'p3',
    user_id: 'demo-user',
    full_name: 'Ana Torres',
    age: 22,
    email: 'ana@email.com',
    phone: '+51 934 567 890',
    modality: 'Online',
    frequency: 'Semanal',
    session_price: 100,
    status: 'pause',
    start_date: '01/11/2025',
    next_session: null,
    notes: 'En pausa por viaje',
    tags: ['autoestima'],
    created_at: '2025-11-01T08:00:00Z',
  },
]

// ─── SESSIONS ─────────────────────────────────────────────────
export const DEMO_SESSIONS = [
  {
    id: 's1',
    user_id: 'demo-user',
    patient_id: 'p1',
    date: '2026-05-20',
    duration: '50 min',
    modality: 'Online',
    session_type: 'Realizada',
    emotional_state_start: '😰 Ansioso/a',
    main_topic: 'Ansiedad laboral y conflicto con jefa',
    raw_notes: '',
    structured_notes:
      'S: Paciente refiere alta carga emocional en entorno laboral.\n' +
      'O: Tensión muscular visible, llanto al relatar situación.\n' +
      'A: Ansiedad moderada asociada a dinámica laboral tóxica.\n' +
      'P: Introducir técnicas de regulación, reestructuración cognitiva.',
    topics_worked: 'Regulación emocional, reestructuración cognitiva',
    interventions_used: 'Respiración diafragmática, registro de pensamientos',
    homework: 'Registro diario de pensamientos automáticos durante situaciones de activación laboral',
    clinical_observations: 'Buena adherencia al proceso. Alta motivación.',
    status: 'realizada',
    created_at: '2026-05-20T09:00:00Z',
  },
  {
    id: 's2',
    user_id: 'demo-user',
    patient_id: 'p1',
    date: '2026-05-13',
    duration: '50 min',
    modality: 'Online',
    session_type: 'Realizada',
    emotional_state_start: '🙂 Estable',
    main_topic: 'Revisión de tareas y avance en regulación',
    raw_notes: '',
    structured_notes:
      'S: Paciente reporta mejora parcial tras practicar respiración.\n' +
      'O: Más tranquila, contacto visual fluido, relato organizado.\n' +
      'A: Progreso en regulación emocional, pendiente trabajo de valores.\n' +
      'P: Continuar con ACT, explorar valores personales.',
    topics_worked: 'ACT, valores personales',
    interventions_used: 'Defusión cognitiva, clarificación de valores',
    homework: 'Carta a su yo del futuro sobre sus valores centrales',
    clinical_observations: 'Exploración de valores muy productiva.',
    status: 'realizada',
    created_at: '2026-05-13T09:00:00Z',
  },
  {
    id: 's3',
    user_id: 'demo-user',
    patient_id: 'p2',
    date: '2026-05-18',
    duration: '60 min',
    modality: 'Presencial',
    session_type: 'Realizada',
    emotional_state_start: '😔 Bajo',
    main_topic: 'Conflicto de pareja y comunicación',
    raw_notes: '',
    structured_notes:
      'S: Discusión con pareja la semana anterior.\n' +
      'O: Afecto embotado, escaso contacto visual.\n' +
      'A: Depresión leve con conflicto vincular.\n' +
      'P: Trabajo en comunicación asertiva.',
    topics_worked: 'Comunicación asertiva, vínculos',
    interventions_used: 'Role-playing, psicoeducación',
    homework: 'Diario de interacciones positivas con su pareja',
    clinical_observations: 'Resistencia inicial superada en segunda mitad.',
    status: 'realizada',
    created_at: '2026-05-18T11:00:00Z',
  },
]

// ─── PAYMENTS ─────────────────────────────────────────────────
export const DEMO_PAYMENTS = [
  {
    id: 'pay1',
    user_id: 'demo-user',
    patient_id: 'p1',
    session_id: 's1',
    amount: 120,
    payment_date: '2026-05-20',
    payment_method: 'Transferencia',
    status: 'pagado',
    notes: '',
    created_at: '2026-05-20T10:00:00Z',
  },
  {
    id: 'pay2',
    user_id: 'demo-user',
    patient_id: 'p1',
    session_id: 's2',
    amount: 120,
    payment_date: '2026-05-13',
    payment_method: 'Efectivo',
    status: 'pagado',
    notes: '',
    created_at: '2026-05-13T10:00:00Z',
  },
  {
    id: 'pay3',
    user_id: 'demo-user',
    patient_id: 'p2',
    session_id: 's3',
    amount: 150,
    payment_date: '2026-05-18',
    payment_method: 'Yape',
    status: 'pagado',
    notes: '',
    created_at: '2026-05-18T12:00:00Z',
  },
  {
    id: 'pay4',
    user_id: 'demo-user',
    patient_id: 'p2',
    session_id: null,
    amount: 150,
    payment_date: null,
    payment_method: '',
    status: 'pendiente',
    notes: 'Próxima sesión',
    created_at: '2026-05-25T08:00:00Z',
  },
]

// ─── APPOINTMENTS ─────────────────────────────────────────────
export const DEMO_APPOINTMENTS = [
  { id: 'ap1', user_id: 'demo-user', patient_id: 'p1', date: '2026-06-03', time: '09:00', duration: '50 min', modality: 'Online',     status: 'confirmado',  notes: '' },
  { id: 'ap2', user_id: 'demo-user', patient_id: 'p2', date: '2026-06-06', time: '11:00', duration: '60 min', modality: 'Presencial', status: 'a_confirmar', notes: 'Confirmar el lunes' },
  { id: 'ap3', user_id: 'demo-user', patient_id: 'p1', date: '2026-06-10', time: '09:00', duration: '50 min', modality: 'Online',     status: 'confirmado',  notes: '' },
  { id: 'ap4', user_id: 'demo-user', patient_id: 'p1', date: '2026-06-17', time: '09:00', duration: '50 min', modality: 'Online',     status: 'confirmado',  notes: '' },
  { id: 'ap5', user_id: 'demo-user', patient_id: 'p2', date: '2026-06-20', time: '11:00', duration: '60 min', modality: 'Presencial', status: 'a_confirmar', notes: '' },
]

// ─── REMINDERS ────────────────────────────────────────────────
export const DEMO_REMINDERS = [
  { id: 'r1', user_id: 'demo-user', title: 'Enviar material a María', completed: false, due_date: null },
  { id: 'r2', user_id: 'demo-user', title: 'Revisar caso Carlos',    completed: false, due_date: null },
  { id: 'r3', user_id: 'demo-user', title: 'Facturar mayo',          completed: true,  due_date: null },
]

// ─── CLINICAL HISTORIES ───────────────────────────────────────
// Keyed by patient_id for O(1) lookup.
// Phase 4: replace with useClinicalHistory(patientId) hook.
export const DEMO_CLINICAL_HISTORIES = {
  p1: {
    id: 'ch1',
    user_id: 'demo-user',
    patient_id: 'p1',
    // Motivo
    explicit_reason:  'Ansiedad generalizada con somatizaciones frecuentes',
    implicit_reason:  'Dificultad para manejar expectativas y autocrítica severa',
    main_symptoms:    'Tensión muscular, rumiación, dificultad para dormir',
    evolution_time:   '2 años',
    // Datos personales
    civil_status:     'Soltera',
    occupation:       'Diseñadora gráfica freelance',
    education_level:  'Universitaria completa',
    living_situation: 'Vive sola',
    // Historia personal
    childhood:            'Infancia estable, padres exigentes con alta demanda de rendimiento',
    adolescence:          'Buen rendimiento escolar, pocas amistades, aislamiento progresivo',
    relationship_history: 'Relaciones cortas, dificultad para confiar en la pareja',
    work_history:         'Freelance desde 2020, alta autoexigencia y dificultad para delegar',
    significant_events:   'Pérdida laboral importante en 2024',
    // Historia familiar
    family_structure:                    'Familia nuclear, 2 hermanos mayores',
    family_dynamics:                     'Madre controladora, padre distante emocionalmente',
    family_psychopathological_history:   'Madre con ansiedad no tratada',
    // Evaluación clínica
    initial_clinical_evaluation: 'Ansiedad generalizada, alta autoexigencia, evitación emocional',
    tests_administered:          'BAI (28 – moderado), BDI-II (14 – leve)',
    // Antecedentes
    previous_psychological_treatments: 'Tratamiento breve en 2022, abandono a los 3 meses',
    previous_psychiatric_treatments:   'Ninguno',
    medication:                        'Ninguna actualmente',
    // Diagnóstico / plan
    diagnosis:            'F41.1 Trastorno de ansiedad generalizada',
    therapeutic_goals:    'Reducir respuestas de ansiedad, mejorar regulación emocional, fortalecer autoestima',
    intervention_plan:    'ACT + TCC, frecuencia semanal, duración estimada 6 meses',
    case_conceptualization: '',
    created_at: '2026-01-22T08:00:00Z',
    updated_at: '2026-05-20T09:00:00Z',
  },
}
