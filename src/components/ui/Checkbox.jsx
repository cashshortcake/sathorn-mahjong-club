import styles from './Checkbox.module.css'

/**
 * Checkbox — custom-styled checkbox
 *
 * When `label` is provided, renders its own <label> wrapper.
 * When used INSIDE an existing <label>, omit `label` and just render the visual.
 *
 * Props:
 *   checked   {bool}
 *   onChange  {fn}      receives boolean (checked state)
 *   disabled  {bool}
 *   label     {string}  optional — renders its own label wrapper when provided
 *   id        {string}  optional — for external <label for="…"> association
 */
function CheckboxVisual({ checked, onChange, disabled, id }) {
  return (
    <span
      className={[
        styles.box,
        checked  ? styles.checked  : '',
        disabled ? styles.disabledBox : '',
      ].filter(Boolean).join(' ')}
    >
      <input
        id={id}
        type="checkbox"
        className={styles.nativeInput}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange && onChange(e.target.checked)}
      />
      {checked && (
        <svg
          viewBox="0 0 10 8"
          fill="none"
          width="10"
          height="8"
          aria-hidden="true"
        >
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

export default function Checkbox({ checked, onChange, disabled, label, id }) {
  if (label) {
    return (
      <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
        <CheckboxVisual checked={checked} onChange={onChange} disabled={disabled} />
        <span className={styles.label}>{label}</span>
      </label>
    )
  }
  return (
    <CheckboxVisual
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      id={id}
    />
  )
}
