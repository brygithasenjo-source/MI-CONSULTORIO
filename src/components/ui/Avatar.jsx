/**
 * Avatar.jsx
 * Circular avatar showing the first letter of a name.
 * Background color is deterministic based on name charCode.
 */

const BG_PALETTE = [
  '#E8F7EE',
  '#FEF3C7',
  '#EFF6FF',
  '#FDF2F8',
  '#EEE9FF',
  '#E0F2FE',
]

export default function Avatar({ name = '?', size = 40, style: extraStyle = {} }) {
  const letter = (name ?? '?').charAt(0).toUpperCase()
  const bgIndex = (name ?? '').charCodeAt(0) % BG_PALETTE.length
  const bg = BG_PALETTE[bgIndex] ?? BG_PALETTE[0]

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: Math.round(size * 0.38),
        color: 'var(--green-dark)',
        flexShrink: 0,
        userSelect: 'none',
        ...extraStyle,
      }}
    >
      {letter}
    </div>
  )
}
