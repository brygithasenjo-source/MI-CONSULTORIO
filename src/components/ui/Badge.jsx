/**
 * Badge.jsx
 * Small pill label used for status, tags, etc.
 *
 * Colors: green | orange | red | purple | gray | blue
 */

const COLORS = {
  green:  { bg: 'var(--green-mint)', text: 'var(--green-dark)' },
  orange: { bg: '#FEF3C7',           text: '#92400E' },
  red:    { bg: '#FEE2E2',           text: '#991B1B' },
  purple: { bg: 'var(--lila)',        text: 'var(--lila-text)' },
  gray:   { bg: '#F1F5F9',           text: '#475569' },
  blue:   { bg: '#EFF6FF',           text: '#1D4ED8' },
}

export default function Badge({ children, color = 'green', style: extraStyle = {} }) {
  const c = COLORS[color] ?? COLORS.gray

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: 700,
        background: c.bg,
        color: c.text,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        ...extraStyle,
      }}
    >
      {children}
    </span>
  )
}
