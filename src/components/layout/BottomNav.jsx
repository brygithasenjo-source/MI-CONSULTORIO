/**
 * BottomNav.jsx
 * Mobile-only bottom navigation bar (shown via CSS media query).
 * Mirrors the same routes as Sidebar.
 */
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/',              icon: '👥', label: 'Pacientes' },
  { path: '/agenda',        icon: '📅', label: 'Agenda' },
  { path: '/finanzas',      icon: '💳', label: 'Finanzas' },
  { path: '/metricas',      icon: '📊', label: 'Métricas' },
  { path: '/configuracion', icon: '⚙️', label: 'Config' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const activePath = location.pathname.startsWith('/paciente')
    ? '/'
    : location.pathname

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación móvil">
      {NAV_ITEMS.map((item) => {
        const isActive = activePath === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
