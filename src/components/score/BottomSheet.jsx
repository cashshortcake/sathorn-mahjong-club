import { useRef, useEffect, useCallback } from 'react'
import { MIN_FAN, MAX_FAN, TOTAL_ROUNDS } from '../../utils/scoring'
import EndGamePanel from './EndGamePanel'
import { StandingsList, RoundHistory } from './ResultsPanel'
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
  resolvedDiscarderId,
  round,
  isEndGame,
  canApply,
  applyDisabledReason,
  onChange,
  onApply,
}) {
  const { items, cappedAt, total } = fanResult

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

  const winTypeDisabled   = isEndGame || total < MIN_FAN
  const winnerDisabled    = isEndGame || total < MIN_FAN
  const label = round === TOTAL_ROUNDS ? 'Apply Final Round' : `Apply Round ${round}`

  return (
    <div className="bs-breakdown-content">

      {/* ── Fan breakdown — #E6E1D7 contained card at top ── */}
      <div className="rp-fan-section">
        <div className="rp-fan-section-header">
          <span className="rp-section-label">Fan Breakdown</span>
          <span className="rp-fan-section-round">Round {round}</span>
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
      </div>

      {/* Winner */}
      <div className="rp-field">
        <label className="rp-field-label">Winner</label>
        <select
          className="rp-select"
          value={scoring.winnerId ?? players[0]?.id ?? ''}
          disabled={winnerDisabled}
          onChange={e => onChange({ winnerId: e.target.value ? Number(e.target.value) : null, discarderId: null })}
        >
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Win type */}
      <div className="rp-field">
        <label className="rp-field-label">Win type</label>
        <div className="rp-toggle">
          <button
            type="button"
            className={`rp-toggle-btn ${scoring.winType === 'selfDraw' ? 'active' : ''}`}
            disabled={winTypeDisabled}
            onClick={() => onChange({ winType: 'selfDraw', discarderId: null })}
          >Self Draw</button>
          <button
            type="button"
            className={`rp-toggle-btn ${scoring.winType === 'discardWin' ? 'active' : ''}`}
            disabled={winTypeDisabled}
            onClick={() => onChange({ winType: 'discardWin', discarderId: null })}
          >Discard Win</button>
        </div>
      </div>

      {/* Discarder selector (only when discard win) */}
      {scoring.winType === 'discardWin' && scoring.winnerId && (
        <div className="rp-field">
          <label className="rp-field-label">Who discarded?</label>
          <select
            className="rp-select"
            value={resolvedDiscarderId || ''}
            disabled={isEndGame}
            onChange={e => onChange({ discarderId: e.target.value ? Number(e.target.value) : null })}
          >
            {players.filter(p => p.id !== scoring.winnerId).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="rp-divider" />

      {/* Payout */}
      <div className="rp-section-label">Payout</div>
      {currentPayouts
        ? (
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
        : (
          null
        )
      }

      {/* Min fan banner — shown whenever total is below minimum */}
      {!isEndGame && total < MIN_FAN && (
        <div className="rp-min-fan-banner">
          ⚠️ Minimum {MIN_FAN} fan required to win
        </div>
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
            {label}
          </button>
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
  onEditRound,
  onHistoryToggle,
  onStartNewGame,
}) {
  const sheetRef  = useRef(null)
  const dragState = useRef(null) // { startY, startHeight, dragging }

  // Expand to 85vh on mount via CSS animation; store current height for drag
  const getSheetHeight = useCallback(() => {
    if (!sheetRef.current) return 0
    return sheetRef.current.getBoundingClientRect().height
  }, [])

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
  }, [getSheetHeight])

  const handlePointerMove = useCallback((e) => {
    const state = dragState.current
    const sheet = sheetRef.current
    if (!state || !sheet) return
    const delta = state.startY - e.clientY   // positive = dragged up
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
    window.removeEventListener('pointerup',   handlePointerUp)
    if (!state || !sheet) return
    sheet.style.transition = ''

    const delta = state.startY - e.clientY
    const vh    = window.innerHeight

    // Snap: if dragged down more than 80px from start, close
    if (delta < -80) {
      onClose()
      return
    }
    // Snap to expanded (85vh) or collapsed (45vh) based on drag direction
    sheet.style.maxHeight = delta > 0 ? `${vh * 0.85}px` : `${vh * 0.45}px`
    dragState.current = null
  }, [handlePointerMove, onClose])

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup',   handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  return (
    <>
      {/* Backdrop */}
      <div className="bs-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="bs-sheet" ref={sheetRef} role="dialog" aria-modal="true">
        {/* Drag handle row — no close button */}
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
                  isEndGame={sharedResultsProps.isEndGame}
                  canApply={sharedResultsProps.canApply}
                  applyDisabledReason={sharedResultsProps.applyDisabledReason}
                  onChange={sharedResultsProps.onChange}
                  onApply={sharedResultsProps.onApply}
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
