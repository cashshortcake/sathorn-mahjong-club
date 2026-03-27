import { useState, useRef, useEffect } from 'react'
import {
  WHOLE_HAND,
  BASIC_SETS,
  WINNING_CONDITIONS,
  SPECIAL_HANDS,
} from '../../utils/scoring'
import Tooltip from '../Tooltip'
import StepperCounter from '../StepperCounter'
import './ScoringForm.css'

// ─── Fan pill ─────────────────────────────────────────────────────────────────
function FanPill({ fan, strikethrough }) {
  return (
    <span className={`sf-fan-pill ${strikethrough ? 'struck' : ''}`}>
      {fan >= 12 ? 'Max' : `+${fan}`}
    </span>
  )
}

// InfoTooltip is now the shared Tooltip component — aliased for local use
const InfoTooltip = ({ text }) => <Tooltip text={text} />

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
function SectionCard({ title, tooltip, subtitle, disabled, children }) {
  return (
    <div className={`sf-section-card ${disabled ? 'sf-section-disabled' : ''}`}>
      <div className="sf-section-head">
        <div>
          <div className="sf-section-title-row">
            <span className="sf-section-title">{title}</span>
            {tooltip && <InfoTooltip text={tooltip} />}
          </div>
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

// ─── Flowers & Seasons Section (Section D) ────────────────────────────────────
function FlowersAndSeasonsSection({ flowers, seatFlower, seasons, seatSeason, noBonus, onChange }) {
  const noBonusDisabled = flowers > 0 || seasons > 0

  return (
    <div className="sf-bonus-wrap">

      {/* No flowers or seasons checkbox */}
      <label className={`sf-option ${noBonusDisabled ? 'disabled' : ''}`}>
        <input
          type="checkbox"
          className="sf-checkbox"
          checked={noBonus && !noBonusDisabled}
          disabled={noBonusDisabled}
          onChange={e => onChange({ noBonus: e.target.checked })}
        />
        <span className="sf-option-label">No flowers or seasons</span>
        <FanPill fan={1} />
      </label>

      {/* Flowers counter */}
      <div className="sf-bonus-counter-group">
        <div className="sf-bonus-counter-row">
          <span className="sf-bonus-counter-label">Flowers</span>
          <StepperCounter
            value={flowers}
            min={0}
            max={4}
            onChange={val => onChange({ flowers: val, seatFlower: false, noBonus: false })}
          />
        </div>
        {flowers === 4 && (
          <span className="sf-flower-auto">All flowers <FanPill fan={2} /></span>
        )}
        {flowers >= 1 && flowers <= 3 && (
          <label className="sf-option sf-bonus-seat-check">
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

      {/* Seasons counter */}
      <div className="sf-bonus-counter-group">
        <div className="sf-bonus-counter-row">
          <span className="sf-bonus-counter-label">Seasons</span>
          <StepperCounter
            value={seasons}
            min={0}
            max={4}
            onChange={val => onChange({ seasons: val, seatSeason: false, noBonus: false })}
          />
        </div>
        {seasons === 4 && (
          <span className="sf-flower-auto">All seasons <FanPill fan={2} /></span>
        )}
        {seasons >= 1 && seasons <= 3 && (
          <label className="sf-option sf-bonus-seat-check">
            <input
              type="checkbox"
              className="sf-checkbox"
              checked={seatSeason}
              onChange={e => onChange({ seatSeason: e.target.checked })}
            />
            <span className="sf-option-label">Includes seat season</span>
            <FanPill fan={1} />
          </label>
        )}
      </div>

    </div>
  )
}

// ─── Main ScoringForm ─────────────────────────────────────────────────────────
export default function ScoringForm({ scoring, isEndGame, onChange }) {
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
        title="Flowers & Seasons"
        tooltip="Flower and Season tiles are linked to your seat wind. Tile 1 = East, Tile 2 = South, Tile 3 = West, Tile 4 = North."
        disabled={isEndGame}
      >
        <FlowersAndSeasonsSection
          flowers={scoring.flowers}
          seatFlower={scoring.seatFlower}
          seasons={scoring.seasons}
          seatSeason={scoring.seatSeason}
          noBonus={scoring.noBonus}
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