/**
 * Input.jsx
 * Unified form field: text input | textarea | select.
 * Use `as="textarea"` or `as="select"` to switch type.
 *
 * For select, pass `options` as:
 *   - string[]              → value and label are the same
 *   - { value, label }[]    → separate value and display label
 */

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  as,           // 'textarea' | 'select' | undefined (→ input)
  rows = 3,
  options = [],
  required = false,
  disabled = false,
  style: extraStyle = {},
  labelStyle = {},
}) {
  const fieldStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    fontSize: '13px',
    fontFamily: 'var(--font)',
    color: 'var(--text)',
    background: disabled ? 'var(--bg)' : 'var(--white)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    resize: as === 'textarea' ? 'vertical' : undefined,
    opacity: disabled ? 0.65 : 1,
    ...extraStyle,
  }

  const renderField = () => {
    if (as === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          style={fieldStyle}
        />
      )
    }

    if (as === 'select') {
      return (
        <select value={value} onChange={onChange} disabled={disabled} style={fieldStyle}>
          {options.map((opt, i) => {
            const val   = opt?.value  ?? opt
            const label = opt?.label  ?? opt
            return <option key={i} value={val}>{label}</option>
          })}
        </select>
      )
    }

    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={fieldStyle}
      />
    )
  }

  return (
    <div style={{ marginBottom: '14px' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '5px',
            ...labelStyle,
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--red)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {renderField()}
    </div>
  )
}
