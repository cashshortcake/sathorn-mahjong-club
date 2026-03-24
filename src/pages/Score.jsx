import { useState, useMemo } from 'react'
import {
  INITIAL_SCORING,
  DEFAULT_GAME_SETTINGS,
  WIND_NAMES,
  calculateFan,
  calculatePayouts,
  validateCompatibility,
  getDefaultDiscarder,
} from '../utils/scoring'
import PlayerSetup      from '../components/score/PlayerSetup'
import ScoringScreen    from '../components/score/ScoringScreen'
import ConfirmationModal from '../components/score/ConfirmationModal'
import Toast            from '../components/score/Toast'

// Wind player icons — baked-in colour, do NOT apply CSS filter
import eastIcon  from '../assets/icons/wind-east-player.svg'
import southIcon from '../assets/icons/wind-south-player.svg'
import westIcon  from '../assets/icons/wind-west-player.svg'
import northIcon from '../assets/icons/wind-north-player.svg'

import './Score.css'

// ─── Player config ────────────────────────────────────────────────────────────
// Wind seat order: East (id 1), South (id 2), West (id 3), North (id 4)
// icon colours are baked into the SVG — no CSS filter needed
const PLAYER_META = [
  { id: 1, color: '#80CAAF', icon: eastIcon,  windSeat: 'East',  windInitial: 'E', defaultName: 'East'  },
  { id: 2, color: '#F5511C', icon: southIcon, windSeat: 'South', windInitial: 'S', defaultName: 'South' },
  { id: 3, color: '#E02126', icon: westIcon,  windSeat: 'West',  windInitial: 'W', defaultName: 'West'  },
  { id: 4, color: '#4F8568', icon: northIcon, windSeat: 'North', windInitial: 'N', defaultName: 'North' },
]

// Initial seat order: [eastId, southId, westId, northId]
const INITIAL_SEAT_ORDER = [1, 2, 3, 4]

export default function Score() {
  // ── Screen ──────────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState('setup')   // 'setup' | 'scoring'

  // ── Players ──────────────────────────────────────────────────────────────────
  const [playerCount, setPlayerCount] = useState(4)
  const [playerNames, setPlayerNames] = useState({
    1: 'Player 1', 2: 'Player 2', 3: 'Player 3', 4: 'Player 4',
  })

  // ── Game settings (locked at game start) ─────────────────────────────────────
  const [gameSettings, setGameSettings] = useState({ ...DEFAULT_GAME_SETTINGS })

  // ── Wind & Round ─────────────────────────────────────────────────────────────
  // seatOrder[0]=currentEastId, [1]=southId, [2]=westId, [3]=northId
  const [seatOrder,        setSeatOrder]        = useState(INITIAL_SEAT_ORDER)
  const [originalSeatOrder, setOriginalSeatOrder] = useState(INITIAL_SEAT_ORDER)
  const [windsCompleted,   setWindsCompleted]   = useState(0)
  const [round,            setRound]            = useState(1)
  const [history,          setHistory]          = useState([])
  const [isEndGame,        setIsEndGame]        = useState(false)

  // ── Scoring ──────────────────────────────────────────────────────────────────
  const [scoring, setScoring] = useState(INITIAL_SCORING)

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [modal,             setModal]             = useState(null)  // { type, data? }
  const [toast,             setToast]             = useState(null)  // string
  const [sheetOpen,         setSheetOpen]         = useState(false)
  const [sheetTab,          setSheetTab]          = useState('breakdown')
  const [historyExpanded,   setHistoryExpanded]   = useState(false)

  // ─── Derived state ───────────────────────────────────────────────────────────
  const currentWind = WIND_NAMES[windsCompleted] || 'East'

  // Players slice for current player count, enriched with current names
  const players = useMemo(() =>
    PLAYER_META.slice(0, playerCount).map(m => ({
      ...m,
      name: playerNames[m.id] || `Player ${m.id}`,
    })),
    [playerCount, playerNames]
  )

  const scores = useMemo(() => {
    const s = {}
    PLAYER_META.forEach(m => { s[m.id] = 0 })
    history.forEach(h => {
      if (h.payouts) {
        Object.entries(h.payouts).forEach(([id, delta]) => {
          s[Number(id)] = (s[Number(id)] || 0) + delta
        })
      }
    })
    return s
  }, [history])

  const fanResult = useMemo(() => calculateFan(scoring), [scoring])

  const resolvedDiscarderId = useMemo(() => {
    if (scoring.isDraw) return null
    if (scoring.winType !== 'discardWin') return null
    return scoring.discarderId || getDefaultDiscarder(players, scoring.winnerId)
  }, [scoring.isDraw, scoring.winType, scoring.discarderId, scoring.winnerId, players])

  const currentPayouts = useMemo(() => {
    if (scoring.isDraw) return null
    if (!scoring.winnerId || !scoring.winType) return null
    if (fanResult.total < (gameSettings.minimumFan || 0) && gameSettings.minimumFan > 0) return null
    if (gameSettings.minimumFan > 0 && fanResult.total === 0) return null
    const playerIds = players.map(p => p.id)
    return calculatePayouts(
      playerIds,
      scoring.winnerId,
      scoring.winType,
      resolvedDiscarderId,
      fanResult.total,
      gameSettings.payoutMode,
      gameSettings.minimumFan,
    )
  }, [
    scoring.isDraw, scoring.winnerId, scoring.winType,
    resolvedDiscarderId, fanResult.total,
    gameSettings.payoutMode, gameSettings.minimumFan,
    players,
  ])

  const canApply = useMemo(() => {
    if (isEndGame) return false
    // Draw is always appliable
    if (scoring.isDraw) return true
    const minFan = gameSettings.minimumFan ?? 3
    if (minFan > 0 && fanResult.total < minFan) return false
    if (!scoring.winnerId) return false
    if (!scoring.winType) return false
    return true
  }, [isEndGame, scoring.isDraw, fanResult.total, gameSettings.minimumFan, scoring.winnerId, scoring.winType])

  const applyDisabledReason = useMemo(() => {
    if (isEndGame) return null
    if (scoring.isDraw) return null
    const minFan = gameSettings.minimumFan ?? 3
    if (fanResult.total === 0 && minFan > 0) return 'Select scoring options to calculate fan'
    if (fanResult.total > 0 && minFan > 0 && fanResult.total < minFan) return `Minimum ${minFan} fan required to win`
    if (!scoring.winnerId) return 'Select winner'
    if (!scoring.winType) return 'Select win type'
    return null
  }, [isEndGame, scoring.isDraw, fanResult.total, gameSettings.minimumFan, scoring.winnerId, scoring.winType])

  // Whether the current round could be the final round of the final wind
  const isFinalWindRound = useMemo(() => {
    if (playerCount < 3) return false
    const originalNorthId = originalSeatOrder[playerCount - 1]  // North seat index = last player
    const currentEastId   = seatOrder[0]
    return (
      currentEastId === originalNorthId &&
      windsCompleted + 1 === gameSettings.totalWinds
    )
  }, [seatOrder, originalSeatOrder, windsCompleted, gameSettings.totalWinds, playerCount])

  // ─── Handlers ────────────────────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleScoringChange(updates) {
    const next = { ...scoring, ...updates }

    // Toggling isDraw clears winner/win-type selections
    if (updates.isDraw !== undefined) {
      if (updates.isDraw) {
        next.winnerId  = null
        next.winType   = null
        next.discarderId = null
      } else {
        // Restore sensible defaults when un-drawing
        next.winnerId  = players[0]?.id ?? 1
        next.winType   = 'selfDraw'
      }
      setScoring(next)
      return
    }

    // Auto-set discarderId when switching to discardWin or changing winner
    if (next.winType === 'discardWin' && !next.discarderId && next.winnerId) {
      next.discarderId = getDefaultDiscarder(players, next.winnerId)
    }
    if (next.winType === 'selfDraw') {
      next.discarderId = null
    }

    const { valid, removed } = validateCompatibility(next)
    setScoring(valid)
    if (removed.length > 0) {
      showToast('Some options were removed due to hand type.')
    }
  }

  function handleStartGame(settings) {
    // settings = gameSettings from PlayerSetup
    const newSettings = { ...DEFAULT_GAME_SETTINGS, ...settings }
    setGameSettings(newSettings)

    // Build initial seat order for this player count
    const initOrder = PLAYER_META.slice(0, playerCount).map(m => m.id)
    // Pad to 4 slots (seatOrder always tracks up to 4, but only playerCount used)
    const fullOrder = [...initOrder]
    while (fullOrder.length < 4) fullOrder.push(null)

    setSeatOrder(fullOrder)
    setOriginalSeatOrder(fullOrder)
    setWindsCompleted(0)
    setRound(1)
    setHistory([])
    setIsEndGame(false)
    setScoring({ ...INITIAL_SCORING, winnerId: initOrder[0] })
    setSheetOpen(false)
    setSheetTab('breakdown')
    setScreen('scoring')
  }

  function handlePlayerCountChange(newCount) {
    if (newCount === playerCount) return
    if (screen === 'scoring' && (history.length > 0 || round > 1)) {
      setModal({ type: 'playerCountChange', data: { newCount } })
    } else {
      setPlayerCount(newCount)
    }
  }

  function handleApply() {
    if (!canApply) return
    // Show final wind confirmation only on the last round of the last wind (and not a draw)
    if (!scoring.isDraw && isFinalWindRound) {
      setModal({ type: 'finalRound' })
      return
    }
    doApplyRound()
  }

  function doApplyRound() {
    const playerIds = players.map(p => p.id)

    // ── Draw round ──────────────────────────────────────────────────────────
    if (scoring.isDraw) {
      const roundEntry = {
        round,
        wind: currentWind,
        selections: { ...scoring },
        fan: 0,
        cappedAt: null,
        breakdown: [],
        payouts: null,
        discarderId: null,
        isDraw: true,
      }
      setHistory(prev => [...prev, roundEntry])
      setModal(null)
      setRound(r => r + 1)
      setScoring({ ...INITIAL_SCORING, winnerId: seatOrder[0] })
      setSheetOpen(false)
      setTimeout(() => setSheetTab('scoreboard'), 100)
      setTimeout(() => setSheetTab('breakdown'),  200)
      return
    }

    // ── Regular round ────────────────────────────────────────────────────────
    const payoutsResult = calculatePayouts(
      playerIds,
      scoring.winnerId,
      scoring.winType,
      resolvedDiscarderId,
      fanResult.total,
      gameSettings.payoutMode,
      gameSettings.minimumFan,
    )

    if (!payoutsResult) {
      showToast('Score calculation error — please try again.')
      return
    }

    const roundEntry = {
      round,
      wind: currentWind,
      selections: { ...scoring },
      fan: fanResult.total,
      cappedAt: fanResult.cappedAt,
      breakdown: fanResult.items,
      payouts: payoutsResult,
      discarderId: resolvedDiscarderId,
      isDraw: false,
    }

    setHistory(prev => [...prev, roundEntry])
    setModal(null)

    // ── Wind / linjang logic ─────────────────────────────────────────────────
    const currentEastId   = seatOrder[0]
    const originalNorthId = originalSeatOrder[playerCount - 1]
    const winnerIsEast    = scoring.winnerId === currentEastId

    if (winnerIsEast) {
      // Linjang: East wins — stays as East, just increment round
      setRound(r => r + 1)
      setScoring({ ...INITIAL_SCORING, winnerId: currentEastId })
      setSheetOpen(false)
      setTimeout(() => setSheetTab('scoreboard'), 100)
      setTimeout(() => setSheetTab('breakdown'),  200)
    } else {
      // East lost — rotate seats: [S, W, N, E]
      const newSeatOrder = [
        seatOrder[1],
        seatOrder[2],
        seatOrder[3],
        seatOrder[0],
      ]

      // Wind completion: current East was the original North player
      const completingWind = currentEastId === originalNorthId

      if (completingWind) {
        const newWindsCompleted = windsCompleted + 1
        if (newWindsCompleted >= gameSettings.totalWinds) {
          // End game
          setIsEndGame(true)
          setSheetOpen(true)  // mobile: auto-open end game sheet
        } else {
          // Start next wind — reset seats to original order
          setWindsCompleted(newWindsCompleted)
          setSeatOrder([...originalSeatOrder])
          setRound(r => r + 1)
          setScoring({ ...INITIAL_SCORING, winnerId: originalSeatOrder[0] })
          setSheetOpen(false)
          setTimeout(() => setSheetTab('scoreboard'), 100)
          setTimeout(() => setSheetTab('breakdown'),  200)
        }
      } else {
        // Mid-wind rotation
        setSeatOrder(newSeatOrder)
        setRound(r => r + 1)
        setScoring({ ...INITIAL_SCORING, winnerId: newSeatOrder[0] })
        setSheetOpen(false)
        setTimeout(() => setSheetTab('scoreboard'), 100)
        setTimeout(() => setSheetTab('breakdown'),  200)
      }
    }
  }

  function handleEditRound(roundIdx) {
    setModal({ type: 'editRound', data: { roundIdx } })
  }

  function doEditRound(roundIdx) {
    const entry = history[roundIdx]
    const truncated = history.slice(0, roundIdx)
    setHistory(truncated)
    setRound(entry.round)
    setScoring({ ...entry.selections })
    setIsEndGame(false)
    setSheetOpen(false)
    setSheetTab('breakdown')
    setModal(null)

    // Restore wind state from history
    if (entry.wind) {
      const windIdx = WIND_NAMES.indexOf(entry.wind)
      setWindsCompleted(windIdx >= 0 ? windIdx : 0)
    }
    // Reconstruct seat order by replaying rotations up to this round
    // For now, restore to originalSeatOrder within the same wind
    // (full seat-order replay from history is complex; restart from original for this wind)
    const windIdx = WIND_NAMES.indexOf(entry.wind ?? 'East')
    if (windIdx > 0) {
      // We're editing into a previous wind — restore original seat order
      setSeatOrder([...originalSeatOrder])
    }
    // Note: mid-wind seat order reconstruction would require replaying all rounds
    // in the same wind; approximation is fine for v1
  }

  function handleStartNewGame() {
    setScreen('setup')
    setRound(1)
    setHistory([])
    setIsEndGame(false)
    setScoring({ ...INITIAL_SCORING })
    setSheetOpen(false)
    setSheetTab('breakdown')
    setSeatOrder(INITIAL_SEAT_ORDER)
    setOriginalSeatOrder(INITIAL_SEAT_ORDER)
    setWindsCompleted(0)
  }

  function handleEditPlayers() {
    setScreen('setup')
  }

  function handleModalConfirm() {
    if (!modal) return
    if (modal.type === 'finalRound') {
      doApplyRound()
    } else if (modal.type === 'editRound') {
      doEditRound(modal.data.roundIdx)
    } else if (modal.type === 'playerCountChange') {
      const newCount = modal.data.newCount
      setPlayerCount(newCount)
      const initOrder = PLAYER_META.slice(0, newCount).map(m => m.id)
      const fullOrder = [...initOrder]
      while (fullOrder.length < 4) fullOrder.push(null)
      setSeatOrder(fullOrder)
      setOriginalSeatOrder(fullOrder)
      setRound(1)
      setHistory([])
      setIsEndGame(false)
      setScoring({ ...INITIAL_SCORING, winnerId: initOrder[0] })
      setModal(null)
      setScreen('setup')
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="score-page">
      {screen === 'setup' && (
        <PlayerSetup
          playerCount={playerCount}
          playerNames={playerNames}
          players={players}
          gameSettings={gameSettings}
          hasActiveGame={history.length > 0 || (screen === 'scoring' && round > 1)}
          onPlayerCountChange={handlePlayerCountChange}
          onNameChange={(id, name) =>
            setPlayerNames(prev => ({ ...prev, [id]: name }))
          }
          onGameSettingsChange={settings => setGameSettings(prev => ({ ...prev, ...settings }))}
          onStartGame={handleStartGame}
          onBackToGame={() => setScreen('scoring')}
        />
      )}

      {screen === 'scoring' && (
        <ScoringScreen
          players={players}
          round={round}
          currentWind={currentWind}
          windsCompleted={windsCompleted}
          history={history}
          scores={scores}
          scoring={scoring}
          fanResult={fanResult}
          currentPayouts={currentPayouts}
          resolvedDiscarderId={resolvedDiscarderId}
          isEndGame={isEndGame}
          canApply={canApply}
          applyDisabledReason={applyDisabledReason}
          gameSettings={gameSettings}
          sheetOpen={sheetOpen}
          sheetTab={sheetTab}
          historyExpanded={historyExpanded}
          onChange={handleScoringChange}
          onApply={handleApply}
          onEditRound={handleEditRound}
          onEditPlayers={handleEditPlayers}
          onSheetOpen={() => setSheetOpen(true)}
          onSheetClose={() => setSheetOpen(false)}
          onSheetTab={setSheetTab}
          onHistoryToggle={() => setHistoryExpanded(e => !e)}
          onStartNewGame={handleStartNewGame}
        />
      )}

      {modal && (
        <ConfirmationModal
          modal={modal}
          onCancel={() => setModal(null)}
          onConfirm={handleModalConfirm}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  )
}
