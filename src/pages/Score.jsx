import { useState, useMemo } from 'react'
import {
  INITIAL_SCORING,
  TOTAL_ROUNDS,
  MIN_FAN,
  calculateFan,
  calculatePayouts,
  validateCompatibility,
  getDefaultDiscarder,
} from '../utils/scoring'
import PlayerSetup      from '../components/score/PlayerSetup'
import ScoringScreen    from '../components/score/ScoringScreen'
import ConfirmationModal from '../components/score/ConfirmationModal'
import Toast            from '../components/score/Toast'
import star1 from '../assets/icons/ticker-star-1.svg'
import star2 from '../assets/icons/ticker-star-2.svg'
import star3 from '../assets/icons/ticker-star-3.svg'
import star4 from '../assets/icons/ticker-star-4.svg'
import './Score.css'

// ─── Player config ────────────────────────────────────────────────────────────
// filter: converts the SVG's near-black fill (#20201E) to each player's colour
const PLAYER_META = [
  { id: 1, color: '#5EC19D', icon: star1, defaultName: 'Player 1',
    filter: 'brightness(0) saturate(100%) invert(69%) sepia(38%) saturate(600%) hue-rotate(116deg) brightness(98%)' },
  { id: 2, color: '#F5511C', icon: star2, defaultName: 'Player 2',
    filter: 'brightness(0) saturate(100%) invert(41%) sepia(94%) saturate(1900%) hue-rotate(6deg) brightness(104%)' },
  { id: 3, color: '#E02126', icon: star3, defaultName: 'Player 3',
    filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(4800%) hue-rotate(347deg) brightness(97%)' },
  { id: 4, color: '#4F8568', icon: star4, defaultName: 'Player 4',
    filter: 'brightness(0) saturate(100%) invert(43%) sepia(20%) saturate(690%) hue-rotate(109deg) brightness(87%)' },
]

export default function Score() {
  // ── Screen ──────────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState('setup')   // 'setup' | 'scoring'

  // ── Players ──────────────────────────────────────────────────────────────────
  const [playerCount, setPlayerCount] = useState(4)
  const [playerNames, setPlayerNames] = useState({
    1: 'Player 1', 2: 'Player 2', 3: 'Player 3', 4: 'Player 4',
  })

  // ── Game ─────────────────────────────────────────────────────────────────────
  const [round, setRound]       = useState(1)
  const [history, setHistory]   = useState([])
  const [isEndGame, setIsEndGame] = useState(false)

  // ── Scoring ──────────────────────────────────────────────────────────────────
  const [scoring, setScoring] = useState(INITIAL_SCORING)

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [modal, setModal]               = useState(null)  // { type, data? }
  const [toast, setToast]               = useState(null)  // string
  const [sheetOpen, setSheetOpen]       = useState(false)
  const [sheetTab, setSheetTab]         = useState('breakdown')
  const [historyExpanded, setHistoryExpanded] = useState(false)

  // ─── Derived state ───────────────────────────────────────────────────────────
  const players = useMemo(() =>
    PLAYER_META.slice(0, playerCount).map(m => ({
      ...m,
      name: playerNames[m.id] || m.defaultName,
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
    if (scoring.winType !== 'discardWin') return null
    return scoring.discarderId || getDefaultDiscarder(players, scoring.winnerId)
  }, [scoring.winType, scoring.discarderId, scoring.winnerId, players])

  const currentPayouts = useMemo(() => {
    if (!scoring.winnerId || !scoring.winType) return null
    if (fanResult.total < MIN_FAN) return null
    const playerIds = players.map(p => p.id)
    return calculatePayouts(
      playerIds,
      scoring.winnerId,
      scoring.winType,
      resolvedDiscarderId,
      fanResult.total
    )
  }, [scoring.winnerId, scoring.winType, resolvedDiscarderId, fanResult.total, players])

  const canApply = useMemo(() => {
    if (isEndGame) return false
    if (fanResult.total < MIN_FAN) return false
    if (!scoring.winnerId) return false
    if (!scoring.winType) return false
    return true
  }, [isEndGame, fanResult.total, scoring.winnerId, scoring.winType])

  const applyDisabledReason = useMemo(() => {
    if (isEndGame) return null
    if (fanResult.total === 0) return 'Select scoring options to calculate fan'
    if (fanResult.total > 0 && fanResult.total < MIN_FAN) return 'Minimum 3 fan required to win'
    if (!scoring.winnerId) return 'Select winner'
    if (!scoring.winType) return 'Select win type'
    return null
  }, [isEndGame, fanResult.total, scoring.winnerId, scoring.winType])

  // ─── Handlers ────────────────────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleScoringChange(updates) {
    const next = { ...scoring, ...updates }

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

  function handleStartGame() {
    setRound(1)
    setHistory([])
    setIsEndGame(false)
    setScoring(INITIAL_SCORING)
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
    if (round === TOTAL_ROUNDS) {
      setModal({ type: 'finalRound' })
      return
    }
    doApplyRound()
  }

  function doApplyRound() {
    const playerIds = players.map(p => p.id)
    const payoutsResult = calculatePayouts(
      playerIds,
      scoring.winnerId,
      scoring.winType,
      resolvedDiscarderId,
      fanResult.total
    )

    if (!payoutsResult) {
      showToast('Score calculation error — please try again.')
      return
    }

    const roundEntry = {
      round,
      selections: { ...scoring },
      fan: fanResult.total,
      cappedAt: fanResult.cappedAt,
      breakdown: fanResult.items,
      payouts: payoutsResult,
      discarderId: resolvedDiscarderId,
    }

    const newHistory = [...history, roundEntry]
    setHistory(newHistory)
    setModal(null)

    if (round === TOTAL_ROUNDS) {
      setIsEndGame(true)
      setSheetOpen(true)   // mobile: auto-open end game sheet
    } else {
      setRound(r => r + 1)
      setScoring(INITIAL_SCORING)
      setSheetOpen(false)
      setTimeout(() => setSheetTab('scoreboard'), 100)
      setTimeout(() => setSheetTab('breakdown'), 200)
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
  }

  function handleStartNewGame() {
    setScreen('setup')
    setRound(1)
    setHistory([])
    setIsEndGame(false)
    setScoring(INITIAL_SCORING)
    setSheetOpen(false)
    setSheetTab('breakdown')
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
      setPlayerCount(modal.data.newCount)
      setRound(1)
      setHistory([])
      setIsEndGame(false)
      setScoring(INITIAL_SCORING)
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
          hasActiveGame={history.length > 0 || (screen === 'scoring' && round > 1)}
          onPlayerCountChange={handlePlayerCountChange}
          onNameChange={(id, name) =>
            setPlayerNames(prev => ({ ...prev, [id]: name }))
          }
          onStartGame={handleStartGame}
          onBackToGame={() => setScreen('scoring')}
        />
      )}

      {screen === 'scoring' && (
        <ScoringScreen
          players={players}
          round={round}
          history={history}
          scores={scores}
          scoring={scoring}
          fanResult={fanResult}
          currentPayouts={currentPayouts}
          resolvedDiscarderId={resolvedDiscarderId}
          isEndGame={isEndGame}
          canApply={canApply}
          applyDisabledReason={applyDisabledReason}
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
