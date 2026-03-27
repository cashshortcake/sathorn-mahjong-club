import './StepperCounter.css'

/**
 * StepperCounter — shared stepper with circular −/+ buttons.
 *
 * Props:
 *   value    {number}  current value
 *   min      {number}  lower bound (default 0)
 *   max      {number}  upper bound (optional — no upper limit if omitted)
 *   onChange {fn}      called with new value
 *   disabled {bool}
 */
export default function StepperCounter({ value, min = 0, max, onChange, disabled = false }) {
  const canDec = !disabled && value > min
  const canInc = !disabled && (max === undefined || value < max)

  return (
    <div className="sc-stepper">
      <button
        className="sc-btn"
        type="button"
        disabled={!canDec}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease"
      >−</button>
      <span className="sc-val">{value}</span>
      <button
        className="sc-btn"
        type="button"
        disabled={!canInc}
        onClick={() => onChange(value + 1)}
        aria-label="Increase"
      >+</button>
    </div>
  )
}
