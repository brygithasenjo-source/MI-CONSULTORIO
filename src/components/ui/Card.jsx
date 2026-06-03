/**
 * Card.jsx
 * White rounded card used everywhere in the app.
 * Pass `onClick` to make it interactive (adds pointer cursor).
 * Pass `hover` to add lift-on-hover effect.
 */

export default function Card({
  children,
  style = {},
  className = '',
  onClick,
  hover = false,
  padding,
}) {
  const base = {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
    cursor: onClick ? 'pointer' : undefined,
    transition: (onClick || hover) ? 'transform 0.15s, box-shadow 0.15s' : undefined,
    padding: padding ?? undefined,
    ...style,
  }

  const handleMouseEnter = (e) => {
    if (onClick || hover) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
    }
  }

  const handleMouseLeave = (e) => {
    if (onClick || hover) {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
    }
  }

  return (
    <div
      style={base}
      className={`card ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
