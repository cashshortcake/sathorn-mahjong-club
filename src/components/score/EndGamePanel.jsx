import { StandingsList, RoundHistory } from './ResultsPanel'
import './EndGamePanel.css'

export default function EndGamePanel({
  players,
  scores,
  history,
  historyExpanded,
  onEditRound,
  onHistoryToggle,
  onStartNewGame,
  compact,
}) {
  const sorted = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
  const winner = sorted[0]

  return (
    <div className={`egp-panel ${compact ? 'compact' : ''}`}>
      {/* Winner highlight */}
      <div className="egp-winner-block">
        <div className="egp-winner-label">Winner</div>
        <div className="egp-winner-icon-circle">
          <img
            className="egp-winner-icon"
            src={winner.icon}
            style={{ filter: winner.filter }}
            alt=""
            aria-hidden
          />
        </div>
        <div className="egp-winner-name">{winner.name}</div>
        <div className="egp-winner-score">{scores[winner.id] || 0} pts</div>
      </div>

      {/* Final standings */}
      <div className="egp-section-label">Final scores</div>
      <StandingsList players={players} scores={scores} />

      {/* Round history */}
      <RoundHistory
        history={history}
        players={players}
        expanded={historyExpanded}
        onToggle={onHistoryToggle}
        onEdit={onEditRound}
        isEndGame
      />

      {/* Start new game */}
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
