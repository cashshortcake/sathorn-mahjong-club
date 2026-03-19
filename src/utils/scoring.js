// ─── Constants ────────────────────────────────────────────────────────────────
export const MAX_FAN = 12
export const MIN_FAN = 3
export const TOTAL_ROUNDS = 4

// ─── Fan Data ─────────────────────────────────────────────────────────────────
export const WHOLE_HAND = [
  { id: 'allChow',    label: 'All Chow Hand',             fan: 1,  info: 'A winning hand made entirely of chows (sequences).' },
  { id: 'allPung',    label: 'All Pung Hand',             fan: 3,  info: 'A winning hand made entirely of pungs and kongs.' },
  { id: 'halfFlush',  label: 'One Suit + Honours',        fan: 3,  info: 'Hand uses only one suit, but can include wind/dragon tiles.' },
  { id: 'sevenPairs', label: 'Seven Pairs',               fan: 4,  info: 'Seven identical pairs. Cannot combine with Basic Sets.' },
  { id: 'pureHand',   label: 'Pure Hand (One Suit Only)', fan: 7,  info: 'Hand uses only one suit — no honour tiles at all.' },
  { id: 'allHonours', label: 'All Honours',               fan: 10, info: 'Hand made entirely of wind and dragon tiles.' },
]

export const BASIC_SETS = [
  { id: 'dragonPung',     label: 'Dragon Pung / Kong',          fan: 1, info: 'A pung or kong of any dragon tile. Can select multiple.' },
  { id: 'seatWind',       label: 'Seat Wind Pung / Kong',       fan: 1, info: "A pung or kong of your own seat wind." },
  { id: 'prevailingWind', label: 'Prevailing Wind Pung / Kong', fan: 1, info: 'A pung or kong of the current round wind.' },
]

export const WINNING_CONDITIONS = [
  { id: 'selfDraw',     label: 'Self Draw',              fan: 1, info: 'Drew the winning tile yourself from the wall.' },
  { id: 'allConcealed', label: 'All Concealed Hand',     fan: 1, info: 'Entire hand was concealed — no exposed melds.' },
  { id: 'lastTile',     label: 'Win on Last Tile',       fan: 1, info: 'Won on the very last tile drawn from the wall.' },
  { id: 'byKong',       label: 'Win by Kong',            fan: 1, info: 'Drew the winning tile after declaring a kong.' },
  { id: 'stealKong',    label: 'Win by Stealing a Kong', fan: 1, info: "Claimed a winning tile from another player's kong declaration." },
  { id: 'doubleKong',   label: 'Win by Double Kong',     fan: 8, info: 'Drew a winning tile after a second consecutive kong.' },
]

export const SPECIAL_HANDS = [
  { id: 'mixedOrphans',    label: 'Mixed Orphans',      fan: 1,  allowBasicSets: true,  info: 'Ones and nines of any suit, plus any set of honour tiles.' },
  { id: 'smallDragons',    label: 'Small Dragons',      fan: 5,  allowBasicSets: false, info: 'Two dragon pungs/kongs and a pair of the third dragon.' },
  { id: 'greatDragons',    label: 'Great Dragons',      fan: 8,  allowBasicSets: false, info: 'Three dragon pungs or kongs.' },
  { id: 'hiddenGold',      label: 'Hidden Gold',        fan: 8,  allowBasicSets: false, info: 'Four pungs, all concealed, won by self-draw.' },
  { id: 'rubyDragon',      label: 'Ruby Dragon',        fan: 10, allowBasicSets: false, info: 'Pung/Kong of Characters (萬) plus pung of the Ruby Dragon.' },
  { id: 'jadeDragon',      label: 'Jade Dragon',        fan: 10, allowBasicSets: false, info: 'Pung/Kong of Bamboos (條) plus pung of the Jade Dragon.' },
  { id: 'pearlDragon',     label: 'Pearl Dragon',       fan: 10, allowBasicSets: false, info: 'Pung/Kong of Circles (筒) plus pung of the Pearl Dragon.' },
  { id: 'orphans',         label: 'Orphans',            fan: 10, allowBasicSets: false, info: 'Pungs/Kongs of only ones and nines across all suits.' },
  { id: 'nineGates',       label: 'Nine Gates',         fan: 10, allowBasicSets: false, info: 'Fully concealed 1-1-2-3-4-5-6-7-8-9-9 of one suit plus one extra. No Self Draw or Pure Hand bonus.' },
  { id: 'smallWinds',      label: 'Small Winds',        fan: 10, allowBasicSets: true,  info: 'Three wind pungs/kongs and a pair of the fourth wind.' },
  { id: 'allKongs',        label: 'All Kongs',          fan: 12, allowBasicSets: false, info: 'Four kongs plus any pair.' },
  { id: 'greatWinds',      label: 'Great Winds',        fan: 12, allowBasicSets: false, info: 'Pungs or kongs of all four wind tiles.' },
  { id: 'thirteenOrphans', label: 'Thirteen Orphans',   fan: 12, allowBasicSets: false, info: 'One of each terminal and honour tile, plus a duplicate.' },
  { id: 'earthlyHand',     label: 'Earthly Hand',       fan: 12, allowBasicSets: false, info: "Non-East player wins on East's very first discard." },
  { id: 'heavenlyHand',    label: 'Heavenly Hand',      fan: 12, allowBasicSets: false, info: 'East player wins with the dealt hand before discarding.' },
]

// ─── Initial Scoring State ────────────────────────────────────────────────────
export const INITIAL_SCORING = {
  wholeHand: null,
  specialHand: null,
  basicSets: [],
  winningConditions: [],
  flowers: 0,
  seatFlower: false,
  noFlowersConfirmed: false,  // user must check a box to claim the No Flowers bonus
  winnerId: 1,                // default to Player 1
  winType: 'selfDraw',        // default to Self Draw
  discarderId: null,
}

// ─── Fan Calculation ──────────────────────────────────────────────────────────
/**
 * Calculates the fan breakdown from scoring selections.
 * Returns { items, total, cappedAt }
 *   items     = [{ label, fan, section, strikethrough }]
 *   cappedAt  = index in items after which the MaxFanBanner is shown (null if not capped)
 *   total     = capped at MAX_FAN
 */
export function calculateFan(scoring) {
  const items = []
  let runningTotal = 0
  let cappedAt = null  // index in items[] where banner is inserted

  function addItem(label, fan, section) {
    if (cappedAt !== null) {
      // Already capped — this item is struck through
      items.push({ label, fan, section, strikethrough: true })
    } else {
      runningTotal += fan
      items.push({ label, fan, section, strikethrough: false })
      if (runningTotal >= MAX_FAN) {
        cappedAt = items.length  // banner inserted after this item
      }
    }
  }

  // ── 1. Special Hand / Whole Hand Pattern ─────────────────────────────────
  if (scoring.specialHand) {
    const sh = SPECIAL_HANDS.find(s => s.id === scoring.specialHand)
    if (sh) addItem(sh.label, sh.fan, 'special')
  } else if (scoring.wholeHand) {
    const wh = WHOLE_HAND.find(w => w.id === scoring.wholeHand)
    if (wh) addItem(wh.label, wh.fan, 'wholeHand')
  }

  // ── 2. Basic Sets ─────────────────────────────────────────────────────────
  const specialDef = scoring.specialHand
    ? SPECIAL_HANDS.find(s => s.id === scoring.specialHand)
    : null
  const basicSetsEnabled =
    scoring.wholeHand !== 'sevenPairs' &&
    (!specialDef || specialDef.allowBasicSets)

  if (basicSetsEnabled) {
    for (const bsId of scoring.basicSets) {
      const bs = BASIC_SETS.find(b => b.id === bsId)
      if (bs) addItem(bs.label, bs.fan, 'basicSets')
    }
  }

  // ── 3. Winning Conditions ─────────────────────────────────────────────────
  const nineGatesActive = scoring.specialHand === 'nineGates'
  for (const wcId of scoring.winningConditions) {
    if (nineGatesActive && wcId === 'selfDraw') continue
    const wc = WINNING_CONDITIONS.find(w => w.id === wcId)
    if (wc) addItem(wc.label, wc.fan, 'winConditions')
  }

  // ── 4. Flowers & Seasons ──────────────────────────────────────────────────
  // No Flowers bonus only applies when the user has explicitly confirmed via checkbox.
  if (scoring.flowers === 0 && scoring.noFlowersConfirmed) {
    addItem('No Flowers', 1, 'flowers')
  } else if (scoring.flowers === 8) {
    addItem('All Flowers', 2, 'flowers')
  } else if (scoring.flowers >= 1 && scoring.flowers <= 7 && scoring.seatFlower) {
    addItem('Seat Flower', 1, 'flowers')
  }

  const total = Math.min(runningTotal, MAX_FAN)
  return { items, total, cappedAt }
}

// ─── Compatibility Validation ─────────────────────────────────────────────────
/**
 * Takes a proposed next scoring state and returns { valid, removed }
 * where removed is an array of human-readable label strings.
 */
export function validateCompatibility(next) {
  const removed = []
  let s = { ...next, basicSets: [...next.basicSets], winningConditions: [...next.winningConditions] }

  // Whole hand and special hand are mutually exclusive
  if (s.specialHand && s.wholeHand) {
    removed.push(WHOLE_HAND.find(w => w.id === s.wholeHand)?.label || s.wholeHand)
    s = { ...s, wholeHand: null }
  }
  if (s.wholeHand && s.specialHand) {
    removed.push(SPECIAL_HANDS.find(sh => sh.id === s.specialHand)?.label || s.specialHand)
    s = { ...s, specialHand: null }
  }

  // Seven Pairs disables all Basic Sets
  if (s.wholeHand === 'sevenPairs' && s.basicSets.length > 0) {
    s.basicSets.forEach(bsId => {
      removed.push(BASIC_SETS.find(b => b.id === bsId)?.label || bsId)
    })
    s = { ...s, basicSets: [] }
  }

  // Special hand that blocks basic sets
  const specialDef = s.specialHand
    ? SPECIAL_HANDS.find(sh => sh.id === s.specialHand)
    : null
  if (specialDef && !specialDef.allowBasicSets && s.basicSets.length > 0) {
    s.basicSets.forEach(bsId => {
      removed.push(BASIC_SETS.find(b => b.id === bsId)?.label || bsId)
    })
    s = { ...s, basicSets: [] }
  }

  // Nine Gates blocks Self Draw and Pure Hand
  if (s.specialHand === 'nineGates') {
    if (s.winningConditions.includes('selfDraw')) {
      removed.push('Self Draw')
      s = { ...s, winningConditions: s.winningConditions.filter(w => w !== 'selfDraw') }
    }
    if (s.wholeHand === 'pureHand') {
      removed.push('Pure Hand')
      s = { ...s, wholeHand: null }
    }
  }

  return { valid: s, removed }
}

// ─── Payout Tables ────────────────────────────────────────────────────────────
// Each row: [selfDrawEach, discardNonDiscarder, discardDiscarder]
const PAYOUT_4P = {
  3:  [2,   1,  2  ],
  4:  [4,   2,  4  ],
  5:  [8,   4,  8  ],
  6:  [16,  8,  16 ],
  7:  [24,  12, 24 ],
  8:  [32,  16, 32 ],
  9:  [48,  24, 48 ],
  10: [64,  32, 64 ],
  11: [96,  48, 96 ],
  12: [128, 64, 128],
}
const PAYOUT_3P = {
  3:  [3,   1,  3  ],
  4:  [6,   2,  6  ],
  5:  [12,  4,  12 ],
  6:  [24,  8,  24 ],
  7:  [36,  12, 36 ],
  8:  [48,  16, 48 ],
  9:  [72,  24, 72 ],
  10: [96,  32, 96 ],
  11: [144, 48, 144],
  12: [192, 64, 192],
}

/**
 * Returns the default discarder — the next player after the winner in sequence.
 */
export function getDefaultDiscarder(players, winnerId) {
  const idx = players.findIndex(p => p.id === winnerId)
  if (idx === -1) return null
  return players[(idx + 1) % players.length].id
}

/**
 * Calculate payouts for all players.
 * Returns { [playerId]: delta } (positive = received, negative = paid)
 * or null if zero-sum check fails.
 */
export function calculatePayouts(playerIds, winnerId, winType, discarderId, fan) {
  const clampedFan = Math.min(Math.max(fan, MIN_FAN), MAX_FAN)
  const count = playerIds.length
  const table = count === 4 ? PAYOUT_4P : PAYOUT_3P
  const row = table[clampedFan] || table[MAX_FAN]
  const [selfDrawEach, discardNonDiscarder, discardDiscarder] = row

  const payouts = {}
  playerIds.forEach(id => { payouts[id] = 0 })

  const losers = playerIds.filter(id => id !== winnerId)

  if (winType === 'selfDraw') {
    payouts[winnerId] = selfDrawEach * losers.length
    losers.forEach(id => { payouts[id] = -selfDrawEach })
  } else {
    // Discard win
    const nonDiscarders = losers.filter(id => id !== discarderId)
    payouts[winnerId] = discardDiscarder + discardNonDiscarder * nonDiscarders.length
    payouts[discarderId] = -discardDiscarder
    nonDiscarders.forEach(id => { payouts[id] = -discardNonDiscarder })
  }

  // Zero-sum integrity check
  const sum = Object.values(payouts).reduce((a, b) => a + b, 0)
  if (sum !== 0) {
    console.error('Payout zero-sum check failed. Sum:', sum, payouts)
    return null
  }

  return payouts
}

/**
 * Re-apply a sequence of round selections to rebuild cumulative scores.
 * Returns the new history array with recalculated payouts.
 */
export function replayHistory(rounds, players) {
  return rounds.map(entry => {
    const { selections } = entry
    const { items, total, cappedAt } = calculateFan(selections)
    const playerIds = players.map(p => p.id)
    const discarderId = selections.winType === 'discardWin'
      ? (selections.discarderId || getDefaultDiscarder(players, selections.winnerId))
      : null
    const payouts = calculatePayouts(
      playerIds,
      selections.winnerId,
      selections.winType,
      discarderId,
      total
    )
    return { ...entry, fan: total, cappedAt, breakdown: items, payouts, discarderId }
  })
}
