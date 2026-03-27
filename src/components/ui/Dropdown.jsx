import styles from './Dropdown.module.css'

/**
 * Dropdown — global select with styled chevron
 *
 * Props:
 *   value       {string|number}
 *   onChange    {fn}                  receives the raw string value
 *   options     {Array<{value, label}>}
 *   placeholder {string}              optional "None" / empty option label
 *   disabled    {bool}
 *   dark        {bool}                dark panel variant (#4B4A4A bg)
 *   fullWidth   {bool}                makes wrapper + select 100% wide
 *   className   {string}              extra class for layout overrides
 */
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
  dark = false,
  fullWidth = false,
  className = '',
}) {
  const wrapClass = [
    styles.wrap,
    dark      ? styles.dark      : '',
    fullWidth  ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapClass}>
      <select
        className={styles.select}
        value={value ?? ''}
        disabled={disabled}
        onChange={e => onChange && onChange(e.target.value)}
      >
        {placeholder !== undefined && (
          <option value="">{placeholder}</option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden="true">▾</span>
    </div>
  )
}
