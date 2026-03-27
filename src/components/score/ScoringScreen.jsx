import ScoringForm    from './ScoringForm'
import ResultsPanel   from './ResultsPanel'
import StickyBottomBar from './StickyBottomBar'
import BottomSheet    from './BottomSheet'
import EndGamePanel   from './EndGamePanel'
import './ScoringScreen.css'

import windEastSvg  from '../../assets/tiles/wind-east.svg'
import windSouthSvg from '../../assets/tiles/wind-south.svg'
import windWestSvg  from '../../assets/tiles/wind-west.svg'
import windNorthSvg from '../../assets/tiles/wind-north.svg'

const WIND_TILES = {
  East:  windEastSvg,
  South: windSouthSvg,
  West:  windWestSvg,
  North: windNorthSvg,
}

const WIND_ORDER = ['East', 'South', 'West', 'North']

function PrevailingWindBadge({ wind }) {
  return (
    <div className="ss-prevailing-wind">
      <span className="ss-prevailing-wind-label">{wind.toUpperCase()}</span>
      <img
        className="ss-prevailing-wind-tile"
        src={WIND_TILES[wind] || WIND_TILES.East}
        alt={wind}
        aria-hidden
      />
    </div>
  )
}

function ScoringTopBar({ players, round, totalRounds, currentWind, isEndGame, onEditPlayers }) {
  const windRoundLabel = isEndGame
    ? `GAME OVER · Round ${round}`
    : `Round ${round} of ${totalRounds}`

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
            : `R${round}/${totalRounds} · ${players.length} Players`}
        </span>
        {/* Prevailing wind badge — desktop only */}
        {!isEndGame && (
          <PrevailingWindBadge wind={currentWind} />
        )}
        {/* Player chips — hidden on mobile, ordered East→South→West→North */}
        <div className="ss-player-chips">
          {[...players]
            .sort((a, b) => WIND_ORDER.indexOf(a.windLabel) - WIND_ORDER.indexOf(b.windLabel))
            .map(p => (
              <span
                key={p.id}
                className="ss-player-chip"
                style={{ borderColor: p.color }}
              >
                {/* Icon reflects current seat wind, not fixed player identity */}
                <img
                  className="ss-player-chip-icon"
                  src={p.seatIcon}
                  alt=""
                  aria-hidden
                />
                {p.name}
              </span>
            ))}
        </div>
      </div>
      <div className="ss-topbar-actions">
        <button
          className="ss-edit-players"
          type="button"
          onClick={onEditPlayers}
        >
          ✏ Edit
        </button>
      </div>
    </div>
  )
}

export default function ScoringScreen({
  players,
  round,
  totalRounds,
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
  bonusPayouts,
  hasBonusPayouts,
  sheetOpen,
  sheetTab,
  historyExpanded,
  onChange,
  onBonusChange,
  onApply,
  onEditRound,
  onEditPlayers,
  onEndGame,
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
    bonusPayouts,
    hasBonusPayouts,
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
    onBonusChange,
    onApply,
    onEditRound,
    onHistoryToggle,
    onEndGame,
  }

  return (
    <div className="ss-page">
      <ScoringTopBar
        players={players}
        round={round}
        totalRounds={totalRounds}
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
        totalRounds={totalRounds}
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
