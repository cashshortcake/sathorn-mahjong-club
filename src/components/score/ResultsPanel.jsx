import './ResultsPanel.css'
import { MIN_FAN, MAX_FAN, TOTAL_ROUNDS } from '../../utils/scoring'

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

// ─── Winner Selector ──────────────────────────────────────────────────────────
function WinnerSelector({ players, winnerId, disabled, onChange }) {
  return (
    <div className="rp-field">
      <label className="rp-field-label">Winner</label>
      <select
        className="rp-select"
        value={winnerId || ''}
        disabled={disabled}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Select winner…</option>
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
  if (!payouts) return (
    <div className="rp-payout-empty">Set winner &amp; win type to see payouts</div>
  )
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
        <div key={p.id} className={`rp-standing-row ${i === 0 ? 'leading' : ''}`}>
          <span className="rp-standing-rank">{i + 1}</span>
          <span className="rp-standing-dot" style={{ background: p.color }} />
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
            const winner = players.find(p => p.id === entry.selections?.winnerId)
            return (
              <div key={idx} className="rp-history-row">
                <span className="rp-history-round">R{entry.round}</span>
                <span className="rp-history-fan">{entry.fan} fan</span>
                <span className="rp-history-winner">
                  {winner ? winner.name : '—'}
                </span>
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
export function ApplyButton({ canApply, disabledReason, round, onApply }) {
  const label = round === TOTAL_ROUNDS ? 'Apply Final Round' : `Apply Round ${round}`
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
        <p className="rp-apply-hint">{disabledReason}</p>
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
  history,
  isEndGame,
  canApply,
  applyDisabledReason,
  historyExpanded,
  onChange,
  onApply,
  onEditRound,
  onHistoryToggle,
}) {

  return (
    <aside className="rp-panel">
      {/* ── Fan total ── */}
      <div className="rp-total-row">
        <span className="rp-total-label">Fan total</span>
        <span className={`rp-total-val ${fanResult.total >= MAX_FAN ? 'capped' : ''}`}>
          {fanResult.total}
        </span>
      </div>

      {/* ── Fan breakdown ── */}
      <FanBreakdownPanel fanResult={fanResult} />

      {/* ── Winner & Win Type ── */}
      <div className="rp-divider" />

      <WinnerSelector
        players={players}
        winnerId={scoring.winnerId}
        disabled={isEndGame}
        onChange={val => onChange({ winnerId: val, discarderId: null })}
      />

      <WinTypeToggle
        winType={scoring.winType}
        disabled={isEndGame}
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

      {/* ── Payout summary ── */}
      <div className="rp-divider" />
      <div className="rp-section-label">Payout</div>
      <PayoutSummary players={players} payouts={currentPayouts} />

      {/* ── Apply button ── */}
      {!isEndGame && (
        <ApplyButton
          canApply={canApply}
          disabledReason={applyDisabledReason}
          round={round}
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
