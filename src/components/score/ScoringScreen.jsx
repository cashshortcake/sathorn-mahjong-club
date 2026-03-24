import ScoringForm    from './ScoringForm'
import ResultsPanel   from './ResultsPanel'
import StickyBottomBar from './StickyBottomBar'
import BottomSheet    from './BottomSheet'
import EndGamePanel   from './EndGamePanel'
import './ScoringScreen.css'

function ScoringTopBar({ players, round, currentWind, isEndGame, onEditPlayers }) {
  const windRoundLabel = isEndGame
    ? `GAME OVER · ${currentWind} · Round ${round}`
    : `${currentWind} Wind · Round ${round}`

  return (
    <div className="ss-topbar">
      <div className="ss-topbar-left">
        {/* Desktop label */}
        <span className={`ss-round-tag ss-round-tag--desktop ${isEndGame ? 'endgame' : ''}`}>
          {windRoundLabel}
        </span>
        {/* Mobile label */}
        <span className={`ss-round-tag ss-round-tag--mobile ${isEndGame ? 'endgame' : ''}`}>
          {isEndGame
            ? 'GAME OVER'
            : `${currentWind} · R${round} · ${players.length} Players`}
        </span>
        {/* Player chips — hidden on mobile */}
        <div className="ss-player-chips">
          {players.map(p => (
            <span
              key={p.id}
              className="ss-player-chip"
              style={{ borderColor: p.color }}
            >
              {/* Wind player icons have baked-in colour — no filter */}
              <img
                className="ss-player-chip-icon"
                src={p.icon}
                alt=""
                aria-hidden
              />
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
        ✏ Edit
      </button>
    </div>
  )
}

export default function ScoringScreen({
  players,
  round,
  currentWind,
  history,
  scores,
  scoring,
  fanResult,
  currentPayouts,
  resolvedDiscarderId,
  isEndGame,
  canApply,
  applyDisabledReason,
  gameSettings,
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
  }

  return (
    <div className="ss-page">
      <ScoringTopBar
        players={players}
        round={round}
        currentWind={currentWind}
        isEndGame={isEndGame}
        onEditPlayers={onEditPlayers}
      />

      <div className="ss-layout">
        {/* Left: Scoring Form */}
        <div className="ss-form-col">
          <ScoringForm
            scoring={scoring}
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
              gameSettings={gameSettings}
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
        round={round}
        currentWind={currentWind}
        isEndGame={isEndGame}
        minimumFan={gameSettings?.minimumFan ?? 3}
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
          gameSettings={gameSettings}
          onEditRound={onEditRound}
          onHistoryToggle={onHistoryToggle}
          onStartNewGame={onStartNewGame}
        />
      )}
    </div>
  )
}
