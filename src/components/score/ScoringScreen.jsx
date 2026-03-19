import ScoringForm    from './ScoringForm'
import ResultsPanel   from './ResultsPanel'
import StickyBottomBar from './StickyBottomBar'
import BottomSheet    from './BottomSheet'
import EndGamePanel   from './EndGamePanel'
import './ScoringScreen.css'

function ScoringTopBar({ players, round, isEndGame, onEditPlayers }) {
  return (
    <div className="ss-topbar">
      <div className="ss-topbar-left">
        <span className={`ss-round-tag ${isEndGame ? 'endgame' : ''}`}>
          {isEndGame ? `Game Over · Round 4` : `Round ${round} of 4`}
        </span>
        <div className="ss-player-chips">
          {players.map(p => (
            <span
              key={p.id}
              className="ss-player-chip"
              style={{ borderColor: p.color }}
            >
              <span className="ss-chip-dot" style={{ background: p.color }} />
              {p.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className="ss-edit-players"
        type="button"
        onClick={onEditPlayers}
      >
        Edit players
      </button>
    </div>
  )
}

export default function ScoringScreen({
  players,
  round,
  history,
  scores,
  scoring,
  fanResult,
  currentPayouts,
  resolvedDiscarderId,
  isEndGame,
  canApply,
  applyDisabledReason,
  sheetOpen,
  sheetTab,
  historyExpanded,
  onChange,
  onApply,
  onEditRound,
  onEditPlayers,
  onSheetOpen,
  onSheetClose,
  onSheetTab,
  onHistoryToggle,
  onStartNewGame,
}) {
  const sharedResultsProps = {
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
  }

  return (
    <div className="ss-page">
      <ScoringTopBar
        players={players}
        round={round}
        isEndGame={isEndGame}
        onEditPlayers={onEditPlayers}
      />

      <div className="ss-layout">
        {/* Left: Scoring Form */}
        <div className="ss-form-col">
          <ScoringForm
            scoring={scoring}
            fanResult={fanResult}
            isEndGame={isEndGame}
            onChange={onChange}
          />
        </div>

        {/* Right: Results panel (desktop) or End Game (desktop) */}
        <div className="ss-results-col">
          {isEndGame ? (
            <EndGamePanel
              players={players}
              scores={scores}
              history={history}
              historyExpanded={historyExpanded}
              onEditRound={onEditRound}
              onHistoryToggle={onHistoryToggle}
              onStartNewGame={onStartNewGame}
            />
          ) : (
            <ResultsPanel {...sharedResultsProps} />
          )}
        </div>
      </div>

      {/* Mobile: sticky bottom bar + sheet */}
      <StickyBottomBar
        fanResult={fanResult}
        isEndGame={isEndGame}
        onExpand={onSheetOpen}
      />

      {sheetOpen && (
        <BottomSheet
          tab={sheetTab}
          onTabChange={onSheetTab}
          onClose={onSheetClose}
          isEndGame={isEndGame}
          sharedResultsProps={sharedResultsProps}
          players={players}
          scores={scores}
          history={history}
          historyExpanded={historyExpanded}
          onEditRound={onEditRound}
          onHistoryToggle={onHistoryToggle}
          onStartNewGame={onStartNewGame}
        />
      )}
    </div>
  )
}
