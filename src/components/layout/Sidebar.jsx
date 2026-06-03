/**
 * Sidebar.jsx
 * Desktop-only vertical navigation (hidden on mobile via CSS).
 * Active item is derived from the current URL path.
 */
import { useNavigate, useLocation } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'

const NAV_ITEMS = [
  { path: '/',               icon: '👥', label: 'Mis Pacientes' },
  { path: '/agenda',         icon: '📅', label: 'Agenda Clínica' },
  { path: '/finanzas',       icon: '💳', label: 'Finanzas' },
  { path: '/metricas',       icon: '📊', label: 'Métricas' },
  { path: '/configuracion',  icon: '⚙️', label: 'Configuración' },
]

export default function Sidebar({ user, onLogout }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  // Mark dashboard and patient profile both as "Mis Pacientes"
  const activePath = location.pathname.startsWith('/paciente')
    ? '/'
    : location.pathname

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        style={{
          padding: '18px 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 34, height: 34,
              borderRadius: '10px',
              background: 'var(--green-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px', flexShrink: 0,
            }}
          >
            🧠
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '13px', color: 'var(--green-dark)' }}>
              Tu Consultorio
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>v2.0 Pro</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--green-mint)' : 'transparent',
                color: isActive ? 'var(--green-dark)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '2px',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                fontFamily: 'var(--font)',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px',
          }}
        >
          <Avatar name={user?.name ?? 'P'} size={32} />
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: '12px', fontWeight: 700,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {user?.name ?? 'Psicólogo'}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Plan Premium</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" full onClick={onLogout}>
          🚪 Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
