import ToggleButton from './ToggleButton'
import styles from './ToggleButtonGroup.module.css'

/**
 * ToggleButtonGroup — pill-shaped single-select toggle container
 *
 * Props:
 *   options   {Array<{value, label}>}
 *   value     {*}       currently selected value
 *   onChange  {fn}      receives the selected value
 *   disabled  {bool}
 *   fullWidth {bool}    makes the group 100% wide with equal-flex buttons
 *   className {string}  extra class for layout overrides
 */
export default function ToggleButtonGroup({
  options = [],
  value,
  onChange,
  disabled,
  fullWidth = false,
  className = '',
}) {
  const groupClass = [
    styles.group,
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={groupClass}>
      {options.map(opt => (
        <ToggleButton
          key={opt.value}
          label={opt.label}
          selected={value === opt.value}
          disabled={disabled}
          onClick={() => onChange && onChange(opt.value)}
        />
      ))}
    </div>
  )
}
