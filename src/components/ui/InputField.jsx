import styles from './InputField.module.css'

/**
 * InputField — global text / number input
 *
 * Props:
 *   value       {string|number}
 *   onChange    {fn}            receives the native change event
 *   placeholder {string}
 *   disabled    {bool}
 *   type        {string}        'text' | 'number' | etc. (default 'text')
 *   className   {string}        extra class for layout overrides
 *   ...rest     forwarded to <input> (onBlur, onFocus, maxLength, min, step, …)
 */
export default function InputField({
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  className = '',
  ...rest
}) {
  return (
    <input
      className={`${styles.input} ${className}`}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      {...rest}
    />
  )
}
