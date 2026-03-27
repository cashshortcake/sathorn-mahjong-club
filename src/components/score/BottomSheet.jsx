import { useRef, useEffect, useCallback } from 'react'
import { MAX_FAN } from '../../utils/scoring'
import Tooltip from '../Tooltip'
import EndGamePanel from './EndGamePanel'
import { StandingsList, RoundHistory, BonusPayoutsSection } from './ResultsPanel'
import Checkbox from '../ui/Checkbox'
import Dropdown from '../ui/Dropdown'
import ToggleButtonGroup from '../ui/ToggleButtonGroup'
import './BottomSheet.css'

// ─── Fan Breakdown (inline, used inside Breakdown tab) ────────────────────────
function MaxFanBanner() {
  return (
    <div className="rp-max-banner">
      <span>🀄</span>
      <span>Max 12 Fan limit</span>
    </div>
  )
}

function BreakdownContent({
  players,
  scoring,
  fanResult,
  currentPayouts,
  bonusPayouts,
  hasBonusPayouts,
  resolvedDiscarderId,
  round,
  currentWind,
  isEndGame,
  canApply,
  gameSettings,
  onChange,
  onBonusChange,
  onApply,
  onEndGame,
}) {
  const { items, cappedAt, total } = fanResult
  const minimumFan  = gameSettings?.minimumFan ?? 3
  const isBelowMin  = minimumFan > 0 && total < minimumFan
  const isDraw      = scoring.isDraw ?? false

  // Fan breakdown rows
  const breakdownRows = []
  items.forEach((item, i) => {
    if (cappedAt !== null && i === cappedAt) {
      breakdownRows.push(<MaxFanBanner key="banner" />)
    }
    breakdownRows.push(
      <div key={`${item.label}-${i}`} className={`rp-breakdown-row ${item.strikethrough ? 'struck' : ''}`}>
        <span className="rp-breakdown-label">{item.label}</span>
        <span className="rp-breakdown-fan">
          {item.fan >= MAX_FAN ? 'Max' : `+${item.fan}`}
        </span>
      </div>
    )
  })
  if (cappedAt !== null && cappedAt >= items.length) {
    breakdownRows.push(<MaxFanBanner key="banner-end" />)
  }

  const windRound = `${currentWind ?? 'East'} · R${round}`
  const applyLabel = isDraw ? `Record Draw (R${round})` : `Apply Round ${round}`

  return (
    <div className="bs-breakdown-content">

      {/* ── Fan breakdown ── */}
      <div className={`rp-fan-section ${isDraw ? 'rp-fan-section--dimmed' : ''}`}>
        <div className="rp-fan-section-header">
          <span className="rp-section-label">Fan Breakdown</span>
          <span className="rp-fan-section-round">{windRound}</span>
        </div>
        {items.length === 0
          ? <div className="rp-breakdown-empty"><span>Select scoring options</span></div>
          : <div className="rp-breakdown">{breakdownRows}</div>
        }
        <div className="rp-divider" />
        <div className="rp-fan-total-row">
          <span className="rp-fan-total-label">Total</span>
          <span className={`rp-fan-total-val ${total >= MAX_FAN ? 'capped' : ''}`}>
            {total} Fan
          </span>
        </div>
        {minimumFan > 0 && total > 0 && total < minimumFan && (
          <div className="rp-min-fan-banner">
            ⚠️ Minimum {minimumFan} fan required to win
          </div>
        )}
      </div>

      {/* Draw toggle */}
      <div className="rp-draw-row">
        <label className="rp-draw-label">
          <Checkbox
            checked={isDraw}
            disabled={isEndGame}
            onChange={val => onChange({ isDraw: val })}
          />
          Draw / No winner
        </label>
        <Tooltip text="No one wins this round. The round is logged and the counter advances, but no chips change hands." />
      </div>

      {/* Winner, win type, discarder (hidden on draw) */}
      {!isDraw && (
        <>
          <div className="rp-field">
            <label className="rp-field-label">Winner</label>
            <Dropdown
              fullWidth
              value={scoring.winnerId ?? players[0]?.id ?? ''}
              options={players.map(p => ({ value: p.id, label: p.name }))}
              disabled={isEndGame || isBelowMin}
              onChange={val => onChange({ winnerId: val ? Number(val) : null, discarderId: null })}
            />
          </div>

          <div className="rp-field">
            <label className="rp-field-label">Win type</label>
            <ToggleButtonGroup
              fullWidth
              options={[
                { value: 'selfDraw',    label: 'Self Draw'    },
                { value: 'discardWin', label: 'Discard Win' },
              ]}
              value={scoring.winType}
              disabled={isEndGame || isBelowMin}
              onChange={val => onChange({ winType: val, discarderId: null })}
            />
          </div>

          {scoring.winType === 'discardWin' && scoring.winnerId && (
            <div className="rp-field">
              <label className="rp-field-label">Who discarded?</label>
              <Dropdown
                fullWidth
                value={resolvedDiscarderId || ''}
                options={players.filter(p => p.id !== scoring.winnerId).map(p => ({ value: p.id, label: p.name }))}
                disabled={isEndGame}
                onChange={val => onChange({ discarderId: val ? Number(val) : null })}
              />
            </div>
          )}
        </>
      )}

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
          currentPayouts && (
            <div className="rp-payout">
              {players.map(p => {
                const delta = currentPayouts[p.id] || 0
                return (
                  <div key={p.id} className="rp-payout-row">
                    <span className="rp-payout-dot" style={{ background: p.color }} />
                    <span className="rp-payout-name">{p.name}</span>
                    <span className={`rp-payout-val ${delta > 0 ? 'pos' : delta < 0 ? 'neg' : ''}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div className="rp-draw-payout-label">Draw — no chips exchanged</div>
        )
      ) : (
        currentPayouts ? (
          <div className="rp-payout">
            {players.map(p => {
              const delta = currentPayouts[p.id] || 0
              return (
                <div key={p.id} className="rp-payout-row">
                  <span className="rp-payout-dot" style={{ background: p.color }} />
                  <span className="rp-payout-name">{p.name}</span>
                  <span className={`rp-payout-val ${delta > 0 ? 'pos' : delta < 0 ? 'neg' : ''}`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                </div>
              )
            })}
          </div>
        ) : null
      )}

      {/* Apply button */}
      {!isEndGame && (
        <div className="rp-apply-wrap">
          <button
            className={`rp-apply-btn ${canApply ? 'active' : 'disabled'}`}
            type="button"
            disabled={!canApply}
            onClick={onApply}
          >
            {applyLabel}
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
      )}

    </div>
  )
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
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

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
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
  gameSettings,
  onEditRound,
  onHistoryToggle,
  onStartNewGame,
}) {
  const sheetRef  = useRef(null)
  const dragState = useRef(null)

  const getSheetHeight = useCallback(() => {
    if (!sheetRef.current) return 0
    return sheetRef.current.getBoundingClientRect().height
  }, [])

  const handlePointerMove = useCallback((e) => {
    const state = dragState.current
    const sheet = sheetRef.current
    if (!state || !sheet) return
    const delta = state.startY - e.clientY
    const newH  = Math.min(
      Math.max(state.startHeight + delta, 80),
      window.innerHeight * 0.92
    )
    sheet.style.maxHeight = `${newH}px`
  }, [])

  const handlePointerUp = useCallback((e) => {
    const state = dragState.current
    const sheet = sheetRef.current
    window.removeEventListener('pointermove', handlePointerMove)
    // eslint-disable-next-line react-hooks/immutability
    window.removeEventListener('pointerup',   handlePointerUp)
    if (!state || !sheet) return
    sheet.style.transition = ''
    const delta = state.startY - e.clientY
    const vh    = window.innerHeight
    if (delta < -80) {
      onClose()
      return
    }
    sheet.style.maxHeight = delta > 0 ? `${vh * 0.85}px` : `${vh * 0.45}px`
    dragState.current = null
  }, [handlePointerMove, onClose])

  const handlePointerDown = useCallback((e) => {
    const sheet = sheetRef.current
    if (!sheet) return
    dragState.current = {
      startY: e.clientY,
      startHeight: getSheetHeight(),
    }
    sheet.style.transition = 'none'
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup',   handlePointerUp)
    e.preventDefault()
  }, [getSheetHeight, handlePointerMove, handlePointerUp])

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup',   handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  return (
    <>
      <div className="bs-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="bs-sheet" ref={sheetRef} role="dialog" aria-modal="true">
        <div
          className="bs-handle-row"
          onPointerDown={handlePointerDown}
          style={{ touchAction: 'none', cursor: 'grab' }}
        >
          <div className="bs-handle" />
        </div>

        {isEndGame ? (
          <div className="bs-content">
            <EndGamePanel
              players={players}
              scores={scores}
              history={history}
              historyExpanded={historyExpanded}
              gameSettings={gameSettings}
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
                <BreakdownContent
                  players={sharedResultsProps.players}
                  scoring={sharedResultsProps.scoring}
                  fanResult={sharedResultsProps.fanResult}
                  currentPayouts={sharedResultsProps.currentPayouts}
                  resolvedDiscarderId={sharedResultsProps.resolvedDiscarderId}
                  round={sharedResultsProps.round}
                  currentWind={sharedResultsProps.currentWind}
                  isEndGame={sharedResultsProps.isEndGame}
                  canApply={sharedResultsProps.canApply}
                  gameSettings={sharedResultsProps.gameSettings}
                  bonusPayouts={sharedResultsProps.bonusPayouts}
                  hasBonusPayouts={sharedResultsProps.hasBonusPayouts}
                  onChange={sharedResultsProps.onChange}
                  onBonusChange={sharedResultsProps.onBonusChange}
                  onApply={sharedResultsProps.onApply}
                  onEndGame={sharedResultsProps.onEndGame}
                />
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
