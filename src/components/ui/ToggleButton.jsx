import styles from './ToggleButton.module.css'

/**
 * ToggleButton — single pill button in a toggle group
 *
 * Not used standalone — always inside <ToggleButtonGroup>.
 * Clicking an already-selected button is a no-op.
 *
 * Props:
 *   label    {string}
 *   selected {bool}
 *   onClick  {fn}
 *   disabled {bool}
 */
export default function ToggleButton({ label, selected, onClick, disabled }) {
  function handleClick() {
    if (!selected && !disabled && onClick) onClick()
  }

  return (
    <button
      type="button"
      className={[
        styles.btn,
        selected ? styles.selected : '',
        disabled ? styles.disabled  : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}
