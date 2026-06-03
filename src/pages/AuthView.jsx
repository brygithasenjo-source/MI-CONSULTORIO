/**
 * AuthView.jsx
 * Login / Register / Forgot password screen.
 *
 * Phase 1: simple useState mock auth.
 * Phase 2: replace handleSubmit with authService calls (Supabase).
 */
import { useState } from 'react'
import Card    from '@/components/ui/Card.jsx'
import Button  from '@/components/ui/Button.jsx'
import Input   from '@/components/ui/Input.jsx'

const MODES = { login: 'login', register: 'register', forgot: 'forgot' }

export default function AuthView({ onLogin }) {
  const [mode,    setMode]    = useState(MODES.login)
  const [email,   setEmail]   = useState('demo@tuconsultorio.com')
  const [pass,    setPass]    = useState('demo123')
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [msg,     setMsg]     = useState({ text: '', error: false })

  const switchMode = (m) => { setMode(m); setMsg({ text: '', error: false }) }

  // ── Phase 2: replace this with authService.login / register / resetPassword ──
  const handleSubmit = async () => {
    setLoading(true)
    setMsg({ text: '', error: false })
    await new Promise((r) => setTimeout(r, 700)) // simulate network

    if (mode === MODES.login) {
      if (email && pass) {
        onLogin({ email, name: email.split('@')[0] })
      } else {
        setMsg({ text: 'Completa email y contraseña.', error: true })
      }
    } else if (mode === MODES.register) {
      if (name && email && pass) {
        onLogin({ email, name })
      } else {
        setMsg({ text: 'Completa todos los campos.', error: true })
      }
    } else {
      setMsg({ text: '✅ Si el correo existe, recibirás un enlace de recuperación.', error: false })
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div className="fade-in" style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: 54, height: 54, borderRadius: '14px',
              background: 'var(--green-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', fontSize: '26px',
            }}
          >
            🧠
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-dark)' }}>
            Tu Consultorio
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', fontSize: '13px' }}>
            Plataforma clínica para psicólogos
          </p>
        </div>

        <Card style={{ padding: '24px' }}>

          {/* Mode toggle — only login / register */}
          {mode !== MODES.forgot && (
            <div
              style={{
                display: 'flex', gap: '3px', marginBottom: '20px',
                background: 'var(--bg)', borderRadius: '10px', padding: '3px',
              }}
            >
              {[MODES.login, MODES.register].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none',
                    background: mode === m ? 'var(--white)' : 'transparent',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    color: mode === m ? 'var(--green-dark)' : 'var(--text-muted)',
                    boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    fontFamily: 'var(--font)',
                    transition: 'all 0.15s',
                  }}
                >
                  {m === MODES.login ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              ))}
            </div>
          )}

          {/* Forgot password intro */}
          {mode === MODES.forgot && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => switchMode(MODES.login)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '13px', padding: 0,
                  display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px',
                  fontFamily: 'var(--font)',
                }}
              >
                ← Volver al login
              </button>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>
          )}

          {/* Fields */}
          {mode === MODES.register && (
            <Input
              label="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dra. Ana Pérez"
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />

          {mode !== MODES.forgot && (
            <Input
              label="Contraseña"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
              style={{ marginBottom: msg.text ? '10px' : '14px' }}
            />
          )}

          {/* Message */}
          {msg.text && (
            <p
              style={{
                fontSize: '13px',
                color: msg.error ? 'var(--red)' : 'var(--green)',
                marginBottom: '12px',
                fontWeight: 500,
              }}
            >
              {msg.text}
            </p>
          )}

          {/* Submit */}
          <Button
            full
            variant="dark"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Cargando...'
              : mode === MODES.login
                ? 'Entrar'
                : mode === MODES.register
                  ? 'Crear cuenta'
                  : 'Enviar enlace'}
          </Button>

          {/* Forgot link */}
          {mode === MODES.login && (
            <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span
                onClick={() => switchMode(MODES.forgot)}
                style={{ color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </p>
          )}
        </Card>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
          🔒 Demo: demo@tuconsultorio.com / demo123
        </p>
      </div>
    </div>
  )
}
