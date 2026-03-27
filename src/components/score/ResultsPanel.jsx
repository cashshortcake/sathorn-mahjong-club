import { useState } from 'react'
import Tooltip from '../Tooltip'
import StepperCounter from '../StepperCounter'
import './ResultsPanel.css'
import { MAX_FAN } from '../../utils/scoring'

// ─── Fan Breakdown Panel ──────────────────────────────────────────────────────
function FanBreakdownPanel({ fanResult, minimumFan }) {
  const { items, cappedAt, total } = fanResult
  const showMinBanner = minimumFan > 0 && total > 0 && total < minimumFan

  if (items.length === 0) {
    return (
      <div className="rp-breakdown-empty">
        <span>Select scoring options</span>
      </div>
    )
  }

  const rows = []
  items.forEach((item, i) => {
    if (cappedAt !== null && i === cappedAt) {
      rows.push(<MaxFanBanner key="banner" />)
    }
    rows.push(
      <div key={`${item.label}-${i}`} className={`rp-breakdown-row ${item.strikethrough ? 'struck' : ''}`}>
        <span className="rp-breakdown-label">{item.label}</span>
        <span className="rp-breakdown-fan">
          {item.fan >= MAX_FAN ? 'Max' : `+${item.fan}`}
        </span>
      </div>
    )
  })
  // Banner at end if total exactly hit cap (Path B)
  if (cappedAt !== null && cappedAt >= items.length) {
    rows.push(<MaxFanBanner key="banner-end" />)
  }

  return (
    <>
      <div className="rp-breakdown">{rows}</div>
      {showMinBanner && (
        <div className="rp-min-fan-banner">
          ⚠️ Minimum {minimumFan} fan required to win
        </div>
      )}
    </>
  )
}

function MaxFanBanner() {
  return (
    <div className="rp-max-banner">
      <span>🀄</span>
      <span>Max 12 Fan limit</span>
    </div>
  )
}

// ─── Draw Toggle ──────────────────────────────────────────────────────────────
function DrawToggle({ isDraw, disabled, onChange }) {
  return (
    <div className="rp-draw-row">
      <label className="rp-draw-label">
        <input
          type="checkbox"
          className="rp-draw-check"
          checked={isDraw}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />
        Draw / No winner
      </label>
      <Tooltip text="No one wins this round. The round is logged and the counter advances, but no chips change hands." />
    </div>
  )
}

// ─── Winner Selector ──────────────────────────────────────────────────────────
function WinnerSelector({ players, winnerId, disabled, onChange }) {
  return (
    <div className="rp-field">
      <label className="rp-field-label">Winner</label>
      <select
        className="rp-select"
        value={winnerId ?? players[0]?.id ?? ''}
        disabled={disabled}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        {players.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Win Type Toggle ──────────────────────────────────────────────────────────
function WinTypeToggle({ winType, disabled, onChange }) {
  return (
    <div className="rp-field">
      <label className="rp-field-label">Win type</label>
      <div className="rp-toggle">
        <button
          type="button"
          className={`rp-toggle-btn ${winType === 'selfDraw' ? 'active' : ''}`}
          disabled={disabled}
          onClick={() => onChange('selfDraw')}
        >Self Draw</button>
        <button
          type="button"
          className={`rp-toggle-btn ${winType === 'discardWin' ? 'active' : ''}`}
          disabled={disabled}
          onClick={() => onChange('discardWin')}
        >Discard Win</button>
      </div>
    </div>
  )
}

// ─── Discarder Selector ───────────────────────────────────────────────────────
function DiscarderSelector({ players, winnerId, discarderId, disabled, onChange }) {
  const options = players.filter(p => p.id !== winnerId)
  return (
    <div className="rp-field">
      <label className="rp-field-label">Who discarded?</label>
      <select
        className="rp-select"
        value={discarderId || ''}
        disabled={disabled}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        {options.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Payout Summary ───────────────────────────────────────────────────────────
function PayoutSummary({ players, payouts }) {
  if (!payouts) return null
  return (
    <div className="rp-payout">
      {players.map(p => {
        const delta = payouts[p.id] || 0
        return (
          <div key={p.id} className="rp-payout-row">
            <span
              className="rp-payout-dot"
              style={{ background: p.color }}
            />
            <span className="rp-payout-name">{p.name}</span>
            <span className={`rp-payout-val ${delta > 0 ? 'pos' : delta < 0 ? 'neg' : ''}`}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Bonus Payouts Section ────────────────────────────────────────────────────
export function BonusPayoutsSection({ players, bonusPayouts, disabled, onChange }) {
  const [open, setOpen] = useState(false)
  const { kongCounts = {} } = bonusPayouts

  const playerCount = players.length

  // Preview: "+X (N players × 10)"
  function kongPreview(pid) {
    const kongs = kongCounts[pid] || 0
    if (kongs === 0) return null
    const earn = kongs * 10 * (playerCount - 1)
    return `+${earn} (${playerCount - 1} players × ${kongs * 10})`
  }

  return (
    <div className="rp-bonus-section">
      <button
        className="rp-bonus-toggle"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="rp-bonus-toggle-left">
          <span className="rp-bonus-label">Bonus Payout</span>
          {!open && (
            <span className="rp-bonus-sub">House rules — does not affect fan</span>
          )}
        </span>
        <span className={`sf-chevron ${open ? 'open' : ''}`}>∨</span>
      </button>

      {open && (
        <div className="rp-bonus-body">
          {/* Declared Kong */}
          <div className="rp-bonus-sub-header">
            <span className="rp-bonus-sub-label">DECLARED KONG</span>
            <Tooltip text="When you declare an open Kong during the round, each other player pays you 10 chips. Counts per Kong." />
          </div>
          {players.map(p => {
            const kongs = kongCounts[p.id] || 0
            const preview = kongPreview(p.id)
            return (
              <div key={p.id} className="rp-bonus-player-row">
                <span className="rp-bonus-player-name">{p.name}</span>
                <StepperCounter
                  value={kongs}
                  min={0}
                  disabled={disabled}
                  onChange={val => onChange({
                    kongCounts: { ...kongCounts, [p.id]: val },
                  })}
                />
                {preview && (
                  <span className="rp-bonus-preview">{preview}</span>
                )}
              </div>
            )
          })}

          {/* Animal Combos */}
          <div className="rp-bonus-sub-header" style={{ marginTop: '0.75rem' }}>
            <span className="rp-bonus-sub-label">ANIMAL COMBOS</span>
            <Tooltip text="If one player holds both Cat + Mouse, or both Chicken + Centipede, they collect 10 chips from each other player per combo." />
          </div>
          {[
            { key: 'catMouseHolder',         label: 'Cat + Mouse' },
            { key: 'chickenCentipedeHolder', label: 'Chicken + Centipede' },
          ].map(({ key, label }) => {
            const currentHolder = bonusPayouts[key]
            return (
              <div key={key} className="rp-bonus-combo-row">
                <span className="rp-bonus-combo-label">{label}</span>
                <select
                  className="rp-select rp-bonus-select"
                  value={currentHolder ?? ''}
                  disabled={disabled}
                  onChange={e => onChange({ [key]: e.target.value ? Number(e.target.value) : null })}
                >
                  <option value="">None</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Standings List ───────────────────────────────────────────────────────────
export function StandingsList({ players, scores }) {
  const sorted = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
  return (
    <div className="rp-standings">
      {sorted.map((p, i) => (
        <div
          key={p.id}
          className={`rp-standing-row ${i === 0 ? 'leading' : ''}`}
        >
          {/* Wind player icons have baked-in colour — no filter */}
          <img
            className="rp-standing-icon"
            src={p.icon}
            alt=""
            aria-hidden
          />
          <span className="rp-standing-name">{p.name}</span>
          {i === 0 && <span className="rp-leading-badge">●</span>}
          <span className="rp-standing-score">{scores[p.id] || 0}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Round History ────────────────────────────────────────────────────────────
export function RoundHistory({ history, players, expanded, onToggle, onEdit }) {
  if (history.length === 0) return null
  return (
    <div className="rp-history">
      <button
        className="rp-history-toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        Round history
        <span className={`sf-chevron ${expanded ? 'open' : ''}`}>▾</span>
      </button>
      {expanded && (
        <div className="rp-history-rows">
          {history.map((entry, idx) => {
            const winner = entry.isDraw
              ? null
              : players.find(p => p.id === entry.selections?.winnerId)
            const windUpper = entry.wind ? entry.wind.toUpperCase() : 'EAST'
            return (
              <div key={idx} className="rp-history-row">
                <span className="rp-history-wind-round">
                  R{entry.round} · {windUpper}
                </span>
                <span className="rp-history-winner">
                  {entry.isDraw ? (
                    <span className="rp-history-draw-label">Draw</span>
                  ) : (
                    winner ? winner.name : '—'
                  )}
                </span>
                {!entry.isDraw && (
                  <span className="rp-history-fan">{entry.fan} fan</span>
                )}
                <button
                  className="rp-history-edit"
                  type="button"
                  onClick={() => onEdit(idx)}
                >
                  Edit
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Apply Button ─────────────────────────────────────────────────────────────
export function ApplyButton({ canApply, round, isDraw, onApply, onEndGame }) {
  const label = isDraw ? `Record Draw (R${round})` : `Apply Round ${round}`
  return (
    <div className="rp-apply-wrap">
      <button
        className={`rp-apply-btn ${canApply ? 'active' : 'disabled'}`}
        type="button"
        disabled={!canApply}
        onClick={onApply}
      >
        {label}
      </button>
      {onEndGame && (
        <button
          className="rp-end-game-link"
          type="button"
          onClick={onEndGame}
        >
          End game
        </button>
      )}
    </div>
  )
}

// ─── Main ResultsPanel ────────────────────────────────────────────────────────
export default function ResultsPanel({
  players,
  scores,
  scoring,
  fanResult,
  currentPayouts,
  bonusPayouts,
  hasBonusPayouts,
  resolvedDiscarderId,
  round,
  currentWind,
  history,
  isEndGame,
  canApply,
  gameSettings,
  historyExpanded,
  onChange,
  onBonusChange,
  onApply,
  onEditRound,
  onHistoryToggle,
  onEndGame,
}) {
  const minimumFan = gameSettings?.minimumFan ?? 3
  const isBelowMin = minimumFan > 0 && fanResult.total < minimumFan
  const isDraw     = scoring.isDraw ?? false

  return (
    <aside className="rp-panel">

      {/* ── Fan breakdown — #E6E1D7 contained card at top ── */}
      <div className={`rp-fan-section ${isDraw ? 'rp-fan-section--dimmed' : ''}`}>
        <div className="rp-fan-section-header">
          <span className="rp-section-label">Fan Breakdown</span>
          <span className="rp-fan-section-round">{currentWind} · R{round}</span>
        </div>
        <FanBreakdownPanel fanResult={fanResult} minimumFan={minimumFan} />
        <div className="rp-divider" />
        <div className="rp-fan-total-row">
          <span className="rp-fan-total-label">Total</span>
          <span className={`rp-fan-total-val ${fanResult.total >= MAX_FAN ? 'capped' : ''}`}>
            {fanResult.total} Fan
          </span>
        </div>
      </div>

      {/* ── Draw toggle ── */}
      <DrawToggle
        isDraw={isDraw}
        disabled={isEndGame}
        onChange={checked => onChange({ isDraw: checked })}
      />

      {/* ── Winner & Win Type (hidden when draw) ── */}
      {!isDraw && (
        <>
          <WinnerSelector
            players={players}
            winnerId={scoring.winnerId}
            disabled={isEndGame || isBelowMin}
            onChange={val => onChange({ winnerId: val, discarderId: null })}
          />

          <WinTypeToggle
            winType={scoring.winType}
            disabled={isEndGame || isBelowMin}
            onChange={val => onChange({ winType: val, discarderId: null })}
          />

          {scoring.winType === 'discardWin' && scoring.winnerId && (
            <DiscarderSelector
              players={players}
              winnerId={scoring.winnerId}
              discarderId={resolvedDiscarderId}
              disabled={isEndGame}
              onChange={val => onChange({ discarderId: val })}
            />
          )}
        </>
      )}

      {/* ── Payout (receipt layout: bonus items above final totals) ── */}
      <div className="rp-divider" />
      <div className="rp-section-label">Payout</div>

      {/* Bonus Payouts — line items */}
      {!isEndGame && bonusPayouts && (
        <BonusPayoutsSection
          players={players}
          bonusPayouts={bonusPayouts}
          disabled={isEndGame}
          onChange={onBonusChange}
        />
      )}

      {/* Final totals */}
      {isDraw ? (
        hasBonusPayouts ? (
          <PayoutSummary players={players} payouts={currentPayouts} />
        ) : (
          <div className="rp-draw-payout-label">Draw — no chips exchanged</div>
        )
      ) : (
        <PayoutSummary players={players} payouts={currentPayouts} />
      )}

      {/* ── Apply button ── */}
      {!isEndGame && (
        <ApplyButton
          canApply={canApply}
          round={round}
          isDraw={isDraw}
          onApply={onApply}
          onEndGame={onEndGame}
        />
      )}

      {/* ── Scoreboard ── */}
      <div className="rp-divider" />
      <div className="rp-section-label">Scoreboard</div>
      <StandingsList players={players} scores={scores} />

      {/* ── Round history ── */}
      <RoundHistory
        history={history}
        players={players}
        expanded={historyExpanded}
        onToggle={onHistoryToggle}
        onEdit={onEditRound}
        isEndGame={isEndGame}
      />

    </aside>
  )
}
