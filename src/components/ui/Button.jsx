/**
 * Button.jsx
 * Unified button component with all variants used across the app.
 *
 * Variants: primary | dark | secondary | outline | ghost | danger | ai
 * Sizes:    sm | md | lg
 */

const VARIANTS = {
  primary:   { background: 'var(--green)',      color: '#fff',                border: 'none' },
  dark:      { background: 'var(--green-dark)', color: '#fff',                border: 'none' },
  secondary: { background: 'var(--green-mint)', color: 'var(--green-dark)',   border: '1px solid var(--border)' },
  outline:   { background: 'transparent',       color: 'var(--text)',         border: '1px solid var(--border)' },
  ghost:     { background: 'transparent',       color: 'var(--text-muted)',   border: 'none' },
  danger:    { background: '#FEE2E2',           color: '#DC2626',             border: '1px solid #FECACA' },
  ai:        { background: 'var(--lila)',        color: 'var(--lila-text)',    border: '1px solid #D8D0FF' },
}

const SIZES = {
  sm: { fontSize: '12px', padding: '5px 11px' },
  md: { fontSize: '13px', padding: '8px 15px' },
  lg: { fontSize: '14px', padding: '10px 20px' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  full = false,
  type = 'button',
  style: extraStyle = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: full ? 'center' : undefined,
    gap: '6px',
    fontFamily: 'var(--font)',
    fontWeight: 600,
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    transition: 'opacity 0.15s, transform 0.1s',
    opacity: disabled ? 0.5 : 1,
    width: full ? '100%' : undefined,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    ...SIZES[size] ?? SIZES.md,
    ...VARIANTS[variant] ?? VARIANTS.primary,
    ...extraStyle,
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={base}>
      {children}
    </button>
  )
}
