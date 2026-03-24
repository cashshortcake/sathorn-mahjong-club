import { RoundHistory } from './ResultsPanel'
import './EndGamePanel.css'

export default function EndGamePanel({
  players,
  scores,
  history,
  historyExpanded,
  gameSettings,
  onEditRound,
  onHistoryToggle,
  onStartNewGame,
  compact,
}) {
  const sorted  = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
  const winner  = sorted[0]

  const currency   = gameSettings?.currency   ?? '฿'
  const multiplier = gameSettings?.multiplier ?? 1

  // Derive wind name + total rounds from history
  const lastEntry     = history[history.length - 1]
  const finalWind     = lastEntry?.wind  ?? 'East'
  const totalRounds   = history.length
  const winnerChips   = scores[winner.id] || 0
  const winnerSummary = `+${winnerChips} points · ${finalWind} Wind · ${totalRounds} rounds`

  return (
    <div className={`egp-panel ${compact ? 'compact' : ''}`}>

      {/* ── Winner block ── */}
      <div className="egp-winner-block">
        <div className="egp-winner-label">Winner</div>
        {/* Wind player icon is 24x24 baked-in; scale up with width/height */}
        <div className="egp-winner-icon-circle">
          <img
            className="egp-winner-icon"
            src={winner.icon}
            alt=""
            aria-hidden
          />
        </div>
        <div className="egp-winner-name">{winner.name}</div>
        <div className="egp-winner-score">{winnerSummary}</div>
      </div>

      {/* ── Final Scores section ── */}
      <div className="egp-scores-header">
        <span className="egp-section-label">Final scores</span>
        <span className="egp-settlement-label">
          {currency} · ×{multiplier}
        </span>
      </div>

      <div className="egp-standings">
        {sorted.map((p, i) => {
          const chips      = scores[p.id] || 0
          const settlement = parseFloat((chips * multiplier).toFixed(2))
          const isPositive = settlement > 0
          const isNegative = settlement < 0

          return (
            <div key={p.id} className={`egp-standing-row ${i === 0 ? 'leading' : ''}`}>
              {/* Wind icon — baked-in colour */}
              <img
                className="egp-standing-icon"
                src={p.icon}
                alt=""
                aria-hidden
              />
              <span className="egp-standing-name">{p.name}</span>
              <span className={`egp-chips ${chips > 0 ? 'pos' : chips < 0 ? 'neg' : ''}`}>
                {chips > 0 ? `+${chips}` : chips} chips
              </span>
              <span className={`egp-settlement ${isPositive ? 'pos' : isNegative ? 'neg' : ''}`}>
                {isPositive ? `+${settlement}` : settlement} {currency}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Round history ── */}
      <RoundHistory
        history={history}
        players={players}
        expanded={historyExpanded}
        onToggle={onHistoryToggle}
        onEdit={onEditRound}
        isEndGame
      />

      {/* ── Start new game ── */}
      <button
        className="egp-new-game-btn"
        type="button"
        onClick={onStartNewGame}
      >
        Start New Game
      </button>
    </div>
  )
}
