import Tooltip from '../Tooltip'
import './ResultsPanel.css'
import { MAX_FAN } from '../../utils/scoring'

// ─── Fan Breakdown Panel ──────────────────────────────────────────────────────
function FanBreakdownPanel({ fanResult }) {
  const { items, cappedAt } = fanResult

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

  return <div className="rp-breakdown">{rows}</div>
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
      <Tooltip text="No winner this round. Seats rotate as normal — the next player in sequence becomes East." />
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
            const windLabel = entry.wind ? entry.wind[0] : 'E'  // first letter
            return (
              <div key={idx} className="rp-history-row">
                <span className="rp-history-wind-round">
                  <span className="rp-history-wind-badge">{windLabel}</span>
                  R{entry.round}
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
export function ApplyButton({ canApply, disabledReason, round, isDraw, onApply }) {
  let label
  if (isDraw) {
    label = `Record Draw (R${round})`
  } else {
    label = `Apply Round ${round}`
  }
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
      {!canApply && disabledReason && (
        <p className="rp-apply-reason">{disabledReason}</p>
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
  resolvedDiscarderId,
  round,
  currentWind,
  history,
  isEndGame,
  canApply,
  applyDisabledReason,
  gameSettings,
  historyExpanded,
  onChange,
  onApply,
  onEditRound,
  onHistoryToggle,
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
        <FanBreakdownPanel fanResult={fanResult} />
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

      {/* ── Payout summary ── */}
      {!isDraw && (
        <>
          <div className="rp-divider" />
          <div className="rp-section-label">Payout</div>
          <PayoutSummary players={players} payouts={currentPayouts} />
        </>
      )}

      {/* ── Min fan banner — dynamic, hidden when minimumFan === 0 ── */}
      {!isEndGame && !isDraw && minimumFan > 0 && isBelowMin && (
        <div className="rp-min-fan-banner">
          ⚠️ Minimum {minimumFan} fan required to win
        </div>
      )}

      {/* ── Apply button ── */}
      {!isEndGame && (
        <ApplyButton
          canApply={canApply}
          disabledReason={applyDisabledReason}
          round={round}
          isDraw={isDraw}
          onApply={onApply}
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
