import ResultsPanel          from './ResultsPanel'
import EndGamePanel          from './EndGamePanel'
import { StandingsList, RoundHistory } from './ResultsPanel'
import './BottomSheet.css'

function TabBar({ tab, onChange }) {
  return (
    <div className="bs-tabs">
      <button
        className={`bs-tab ${tab === 'breakdown' ? 'active' : ''}`}
        type="button"
        onClick={() => onChange('breakdown')}
      >Breakdown</button>
      <button
        className={`bs-tab ${tab === 'scoreboard' ? 'active' : ''}`}
        type="button"
        onClick={() => onChange('scoreboard')}
      >Scoreboard</button>
    </div>
  )
}

export default function BottomSheet({
  tab,
  onTabChange,
  onClose,
  isEndGame,
  sharedResultsProps,
  players,
  scores,
  history,
  historyExpanded,
  onEditRound,
  onHistoryToggle,
  onStartNewGame,
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="bs-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="bs-sheet" role="dialog" aria-modal="true">
        <div className="bs-handle-row">
          <div className="bs-handle" />
          <button className="bs-close" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {isEndGame ? (
          /* End game — no tabs, just the EndGamePanel content */
          <div className="bs-content">
            <EndGamePanel
              players={players}
              scores={scores}
              history={history}
              historyExpanded={historyExpanded}
              onEditRound={onEditRound}
              onHistoryToggle={onHistoryToggle}
              onStartNewGame={onStartNewGame}
              compact
            />
          </div>
        ) : (
          <>
            <TabBar tab={tab} onChange={onTabChange} />
            <div className="bs-content">
              {tab === 'breakdown' && (
                <ResultsPanel {...sharedResultsProps} />
              )}
              {tab === 'scoreboard' && (
                <div className="bs-scoreboard">
                  <StandingsList players={players} scores={scores} />
                  <RoundHistory
                    history={history}
                    players={players}
                    expanded={historyExpanded}
                    onToggle={onHistoryToggle}
                    onEdit={onEditRound}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
