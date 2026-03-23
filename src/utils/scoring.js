// ─── Constants ────────────────────────────────────────────────────────────────
export const MAX_FAN = 12
export const MIN_FAN = 3
export const TOTAL_ROUNDS = 4

// ─── Fan Data ─────────────────────────────────────────────────────────────────
export const WHOLE_HAND = [
  { id: 'allChow',    label: 'All Chow Hand',             fan: 1,  info: 'Your entire hand is built from runs (e.g. 3-4-5 Bamboo). No triplets.' },
  { id: 'allPung',    label: 'All Pung Hand',             fan: 3,  info: 'Your entire hand is built from triplets and a pair. No runs.' },
  { id: 'halfFlush',  label: 'One Suit + Honours',        fan: 3,  info: 'All your tiles are from one suit (e.g. only Bamboo), plus any wind or dragon tiles.' },
  { id: 'sevenPairs', label: 'Seven Pairs',               fan: 4,  info: 'Instead of the usual 4 sets + 1 pair, your hand is seven different pairs.' },
  { id: 'pureHand',   label: 'Pure Hand (One Suit Only)', fan: 7,  info: 'All your tiles are from one suit only — no winds or dragons at all.' },
  { id: 'allHonours', label: 'All Honours',               fan: 10, info: 'Your entire hand is made of wind and dragon tiles only — no numbered suits.' },
]

export const BASIC_SETS = [
  { id: 'dragonPung',     label: 'Dragon Pung / Kong',          fan: 1, info: 'You have three (or four) of the same dragon tile. Select once per dragon triplet you have.' },
  { id: 'seatWind',       label: 'Seat Wind Pung / Kong',       fan: 1, info: 'You have three (or four) of your own seat wind — the wind assigned to your position at the table.' },
  { id: 'prevailingWind', label: 'Prevailing Wind Pung / Kong', fan: 1, info: 'You have three (or four) of the current round wind — the wind that applies to everyone this round.' },
]

export const WINNING_CONDITIONS = [
  { id: 'selfDraw',     label: 'Self Draw',              fan: 1, info: 'You drew the winning tile yourself from the wall, rather than taking it from another player\'s discard.' },
  { id: 'allConcealed', label: 'All Concealed Hand',     fan: 1, info: 'You never picked up a tile from another player\'s discard — your entire hand was drawn from the wall.' },
  { id: 'lastTile',     label: 'Win on Last Tile',       fan: 1, info: 'You won on the very last tile drawn from the wall before the game would have been a draw.' },
  { id: 'byKong',       label: 'Win by Kong',            fan: 1, info: 'After adding a fourth tile to make a kong, you drew an extra tile from the wall — and that tile won the game.' },
  { id: 'stealKong',    label: 'Win by Stealing a Kong', fan: 1, info: 'Another player tried to upgrade a triplet to a kong by adding a fourth tile — and that tile completed your hand.' },
  { id: 'doubleKong',   label: 'Win by Double Kong',     fan: 8, info: 'You declared two kongs in a row, drew the extra tile after the second one, and that tile won the game.' },
]

export const SPECIAL_HANDS = [
  { id: 'mixedOrphans',    label: 'Mixed Orphans',      fan: 1,  allowBasicSets: true,  info: 'Your hand uses only 1s and 9s from any suit, plus a set of wind or dragon tiles.' },
  { id: 'smallDragons',    label: 'Small Dragons',      fan: 5,  allowBasicSets: false, info: 'You have triplets of two different dragons, and a pair of the third.' },
  { id: 'greatDragons',    label: 'Great Dragons',      fan: 8,  allowBasicSets: false, info: 'You have triplets of all three dragons — Ruby, Jade, and Pearl.' },
  { id: 'hiddenGold',      label: 'Hidden Gold',        fan: 8,  allowBasicSets: false, info: 'Four triplets, all kept hidden (no exposed melds), won by drawing the final tile yourself.' },
  { id: 'rubyDragon',      label: 'Ruby Dragon',        fan: 10, allowBasicSets: false, info: 'A triplet of Characters (萬) tiles, plus a triplet of the Ruby Dragon (中).' },
  { id: 'jadeDragon',      label: 'Jade Dragon',        fan: 10, allowBasicSets: false, info: 'A triplet of Bamboo (條) tiles, plus a triplet of the Jade Dragon (發).' },
  { id: 'pearlDragon',     label: 'Pearl Dragon',       fan: 10, allowBasicSets: false, info: 'A triplet of Dots (筒) tiles, plus a triplet of the Pearl Dragon (白).' },
  { id: 'orphans',         label: 'Orphans',            fan: 10, allowBasicSets: false, info: 'Your entire hand is made of triplets of 1s and 9s only — from any combination of suits.' },
  { id: 'nineGates',       label: 'Nine Gates',         fan: 10, allowBasicSets: false, info: 'A fully hidden hand: 1-1-2-3-4-5-6-7-8-9-9 of one suit, plus one extra tile from the same suit. Self Draw and Pure Hand bonuses don\'t apply.' },
  { id: 'smallWinds',      label: 'Small Winds',        fan: 10, allowBasicSets: true,  info: 'Triplets of three different winds, plus a pair of the fourth wind.' },
  { id: 'allKongs',        label: 'All Kongs',          fan: 12, allowBasicSets: false, info: 'All four of your sets are kongs (four identical tiles). Any pair completes the hand.' },
  { id: 'greatWinds',      label: 'Great Winds',        fan: 12, allowBasicSets: false, info: 'Triplets of all four winds — East, South, West, and North.' },
  { id: 'thirteenOrphans', label: 'Thirteen Orphans',   fan: 12, allowBasicSets: false, info: 'One of every terminal and honour tile (1 and 9 of each suit, plus all winds and dragons), plus one duplicate.' },
  { id: 'earthlyHand',     label: 'Earthly Hand',       fan: 12, allowBasicSets: false, info: 'You win on the very first tile East discards at the start of the round — before anyone else has taken a turn.' },
  { id: 'heavenlyHand',    label: 'Heavenly Hand',      fan: 12, allowBasicSets: false, info: 'You are East, and you win with the tiles you were originally dealt — before discarding anything.' },
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