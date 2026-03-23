import { useState, useRef, useEffect } from 'react'
import {
  WHOLE_HAND,
  BASIC_SETS,
  WINNING_CONDITIONS,
  SPECIAL_HANDS,
} from '../../utils/scoring'
import './ScoringForm.css'

// ─── Fan pill ─────────────────────────────────────────────────────────────────
function FanPill({ fan, strikethrough }) {
  return (
    <span className={`sf-fan-pill ${strikethrough ? 'struck' : ''}`}>
      {fan >= 12 ? 'Max' : `+${fan}`}
    </span>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function InfoTooltip({ text }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const timerRef = useRef(null)
  const open = hovered || clicked

  function handleMouseEnter() { setHovered(true) }
  function handleMouseLeave() { setHovered(false) }

  function handleClick() {
    if (hovered) return
    if (!clicked) {
      setClicked(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setClicked(false), 3000)
    } else {
      clearTimeout(timerRef.current)
      setClicked(false)
    }
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <span className="sf-info-wrap">
      <button
        className="sf-info-btn"
        type="button"
        aria-label="More info"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        ⓘ
      </button>
      {open && <span className="sf-tooltip">{text}</span>}
    </span>
  )
}

// ─── Radio option (Section A) ─────────────────────────────────────────────────
function RadioOption({ item, selected, disabled, strikethrough, onChange }) {
  return (
    <label className={`sf-option ${disabled ? 'disabled' : ''} ${strikethrough ? 'struck' : ''}`}>
      <input
        type="radio"
        className="sf-radio"
        checked={selected}
        disabled={disabled}
        onChange={() => onChange(selected ? null : item.id)}
        onClick={() => selected && onChange(null)}
      />
      <span className="sf-option-label">{item.label}</span>
      <InfoTooltip text={item.info} />
      <FanPill fan={item.fan} strikethrough={strikethrough} />
    </label>
  )
}

// ─── Checkbox option (Sections B, C, E) ───────────────────────────────────────
function CheckboxOption({ item, checked, disabled, strikethrough, onChange }) {
  return (
    <label className={`sf-option ${disabled ? 'disabled' : ''} ${strikethrough ? 'struck' : ''}`}>
      <input
        type="checkbox"
        className="sf-checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(item.id, e.target.checked)}
      />
      <span className="sf-option-label">{item.label}</span>
      <InfoTooltip text={item.info} />
      <FanPill fan={item.fan} strikethrough={strikethrough} />
    </label>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ dot, title, subtitle, disabled, children }) {
  return (
    <div className={`sf-section-card ${disabled ? 'sf-section-disabled' : ''}`}>
      <div className="sf-section-head">
        <div>
          <div className="sf-section-title">{title}</div>
          {subtitle && <div className="sf-section-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="sf-section-body">{children}</div>
    </div>
  )
}

// ─── Collapse Section (Section E) ─────────────────────────────────────────────
function CollapseSection({ dot, title, badge, disabled, children }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (open) {
      setHeight(bodyRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [open])

  return (
    <div className={`sf-section-card sf-collapse ${disabled ? 'sf-section-disabled' : ''}`}>
      <button
        className="sf-collapse-head"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="sf-section-dot" style={{ background: dot }} />
        <span className="sf-section-title">{title}</span>
        {badge && <span className="sf-badge">{badge}</span>}
        <span className={`sf-chevron ${open ? 'open' : ''}`}>∨</span>
      </button>
      <div
        style={{
          maxHeight: height,
          overflow: open && height > 0 ? 'visible' : 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div ref={bodyRef} className="sf-section-body">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Flower Counter (Section D) ───────────────────────────────────────────────
function FlowerCounter({ flowers, seatFlower, noFlowersConfirmed, onChange }) {
  const isNoFlowers = flowers === 0
  const isAllFlowers = flowers === 8
  const showSeatFlower = flowers >= 1 && flowers <= 7

  return (
    <div className="sf-flower-wrap">
      <div className="sf-flower-counter">
        <button
          className="sf-counter-btn"
          type="button"
          disabled={flowers === 0}
          onClick={() => onChange({ flowers: flowers - 1, seatFlower: false, noFlowersConfirmed: false })}
          aria-label="Decrease flowers"
        >−</button>
        <span className="sf-counter-val">{flowers}</span>
        <button
          className="sf-counter-btn"
          type="button"
          disabled={flowers === 8}
          onClick={() => onChange({ flowers: flowers + 1, seatFlower: false, noFlowersConfirmed: false })}
          aria-label="Increase flowers"
        >+</button>
      </div>

      {isNoFlowers && (
        <label className="sf-option sf-seat-flower">
          <input
            type="checkbox"
            className="sf-checkbox"
            checked={noFlowersConfirmed}
            onChange={e => onChange({ noFlowersConfirmed: e.target.checked })}
          />
          <span className="sf-option-label">No Flowers</span>
          <FanPill fan={1} />
        </label>
      )}
      {isAllFlowers && (
        <span className="sf-flower-auto">
          All Flowers <FanPill fan={2} />
        </span>
      )}
      {showSeatFlower && (
        <label className="sf-option sf-seat-flower">
          <input
            type="checkbox"
            className="sf-checkbox"
            checked={seatFlower}
            onChange={e => onChange({ seatFlower: e.target.checked })}
          />
          <span className="sf-option-label">Includes seat flower</span>
          <FanPill fan={1} />
        </label>
      )}
    </div>
  )
}

// ─── Main ScoringForm ─────────────────────────────────────────────────────────
export default function ScoringForm({ scoring, fanResult, isEndGame, onChange }) {
  const { items: fanItems, cappedAt } = fanResult

  function isItemStruck(section) {
    if (cappedAt === null) return false
    return fanItems
      .slice(cappedAt)
      .some(fi => fi.section === section)
  }

  const specialDef = scoring.specialHand
    ? SPECIAL_HANDS.find(s => s.id === scoring.specialHand)
    : null
  const basicSetsEnabled =
    scoring.wholeHand !== 'sevenPairs' &&
    (!specialDef || specialDef.allowBasicSets)

  const selfDrawDisabled = scoring.specialHand === 'nineGates'

  return (
    <div className={`sf-form ${isEndGame ? 'sf-form-disabled' : ''}`}>

      {/* ── Section A: Whole Hand Pattern ── */}
      <SectionCard
        dot="#4F8568"
        title="Whole Hand Pattern"
        subtitle="Select one — clears if a special hand is chosen"
        disabled={isEndGame || !!scoring.specialHand}
      >
        {WHOLE_HAND.map(item => (
          <RadioOption
            key={item.id}
            item={item}
            selected={scoring.wholeHand === item.id}
            disabled={isEndGame || !!scoring.specialHand}
            strikethrough={false}
            onChange={val => onChange({ wholeHand: val, specialHand: null })}
          />
        ))}
      </SectionCard>

      {/* ── Section B: Basic Sets ── */}
      <SectionCard
        dot="#F5511C"
        title="Basic Sets"
        subtitle="Each dragon counts separately"
        disabled={isEndGame || !basicSetsEnabled}
      >
        {BASIC_SETS.map(item => (
          <CheckboxOption
            key={item.id}
            item={item}
            checked={scoring.basicSets.includes(item.id)}
            disabled={isEndGame || !basicSetsEnabled}
            strikethrough={false}
            onChange={(id, checked) => {
              const next = checked
                ? [...scoring.basicSets, id]
                : scoring.basicSets.filter(x => x !== id)
              onChange({ basicSets: next })
            }}
          />
        ))}
        {!basicSetsEnabled && (
          <p className="sf-section-note">
            {scoring.wholeHand === 'sevenPairs'
              ? 'Disabled — Seven Pairs cannot combine with Basic Sets.'
              : 'Disabled — selected special hand does not stack with Basic Sets.'}
          </p>
        )}
      </SectionCard>

      {/* ── Section C: Winning Conditions ── */}
      <SectionCard
        dot="#E02126"
        title="Winning Conditions"
        subtitle="Select all that apply"
        disabled={isEndGame}
      >
        {WINNING_CONDITIONS.map(item => {
          const isDisabled = isEndGame || (item.id === 'selfDraw' && selfDrawDisabled)
          return (
            <CheckboxOption
              key={item.id}
              item={item}
              checked={scoring.winningConditions.includes(item.id)}
              disabled={isDisabled}
              strikethrough={false}
              onChange={(id, checked) => {
                const next = checked
                  ? [...scoring.winningConditions, id]
                  : scoring.winningConditions.filter(x => x !== id)
                onChange({ winningConditions: next })
              }}
            />
          )
        })}
      </SectionCard>

      {/* ── Section D: Flowers & Seasons ── */}
      <SectionCard
        dot="#80CAAF"
        title="Flowers & Seasons"
        subtitle="Count of flower tiles held"
        disabled={isEndGame}
      >
        <FlowerCounter
          flowers={scoring.flowers}
          seatFlower={scoring.seatFlower}
          noFlowersConfirmed={scoring.noFlowersConfirmed}
          onChange={updates => onChange(updates)}
        />
      </SectionCard>

      {/* ── Section E: Special Hands ── */}
      <CollapseSection
        dot="#C8B89A"
        title="Special Hands"
        badge="Rare"
        disabled={isEndGame}
      >
        {SPECIAL_HANDS.map(item => (
          <RadioOption
            key={item.id}
            item={item}
            selected={scoring.specialHand === item.id}
            disabled={isEndGame}
            strikethrough={false}
            onChange={val => {
              if (val === null) {
                onChange({ specialHand: null })
              } else {
                onChange({ specialHand: item.id, wholeHand: null })
              }
            }}
          />
        ))}
      </CollapseSection>

    </div>
  )
}