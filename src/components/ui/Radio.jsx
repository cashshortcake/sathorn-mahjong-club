import styles from './Radio.module.css'

/**
 * Radio — custom-styled radio button
 *
 * When `label` is provided, renders its own <label> wrapper.
 * When used INSIDE an existing <label>, omit `label` and just render the visual.
 *
 * Props:
 *   checked   {bool}
 *   onChange  {fn}      receives boolean (checked state) — fire on any change
 *   onClick   {fn}      optional — forwarded to native input for deselectable radio behaviour
 *   disabled  {bool}
 *   name      {string}  radio group name
 *   label     {string}  optional — renders its own label wrapper when provided
 *   id        {string}  optional — for external <label for="…"> association
 */
function RadioVisual({ checked, onChange, onClick, disabled, id, name }) {
  return (
    <span
      className={[
        styles.circle,
        checked  ? styles.checked      : '',
        disabled ? styles.disabledCircle : '',
      ].filter(Boolean).join(' ')}
    >
      <input
        id={id}
        name={name}
        type="radio"
        className={styles.nativeInput}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange && onChange(e.target.checked)}
        onClick={onClick}
      />
      {checked && <span className={styles.dot} aria-hidden="true" />}
    </span>
  )
}

export default function Radio({ checked, onChange, onClick, disabled, label, id, name }) {
  if (label) {
    return (
      <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
        <RadioVisual
          checked={checked}
          onChange={onChange}
          onClick={onClick}
          disabled={disabled}
          name={name}
        />
        <span className={styles.label}>{label}</span>
      </label>
    )
  }
  return (
    <RadioVisual
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      disabled={disabled}
      id={id}
      name={name}
    />
  )
}
