import Tooltip from '../Tooltip'
import './PlayerSetup.css'

// ─── Segmented Toggle ─────────────────────────────────────────────────────────
function SegmentedToggle({ options, value, onChange }) {
  return (
    <div className="ps-toggle">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`ps-toggle-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Player Name Input ────────────────────────────────────────────────────────
function PlayerNameInput({ player, value, onChange }) {
  // Fallback to "Player N" — not the wind seat name — so users can clear freely
  function handleBlur(e) {
    const trimmed = e.target.value.trim()
    onChange(trimmed || `Player ${player.id}`)
  }

  return (
    <div className="ps-player-row">
      {/* Wind player icon — colour baked in, no CSS filter */}
      <img
        className="ps-player-icon"
        src={player.icon}
        alt={player.windSeat}
        aria-hidden
      />
      <input
        type="text"
        className="ps-name-input"
        value={value}
        placeholder={`Player ${player.id}`}
        onChange={e => onChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={e => e.target.select()}
        maxLength={24}
      />
    </div>
  )
}

// ─── Game Settings Panel ──────────────────────────────────────────────────────
function GameSettingsPanel({ settings, onChange }) {
  return (
    <>
      {/* Game Wind */}
      <div className="ps-section">
        <div className="ps-section-label-row">
          <label className="ps-section-label">Game Wind</label>
          <Tooltip>
            <p>A wind is one full cycle where every player gets to be East.</p>
            <ul>
              <li><strong>1 Wind</strong> — short game</li>
              <li><strong>2 Winds</strong> — medium game</li>
              <li><strong>4 Winds</strong> — full traditional game</li>
            </ul>
            <p>If East wins, they stay as East (<em>linjang</em>) and the round count continues.</p>
          </Tooltip>
        </div>
        <SegmentedToggle
          options={[
            { value: 1, label: '1 Wind'  },
            { value: 2, label: '2 Winds' },
            { value: 4, label: '4 Winds' },
          ]}
          value={settings.totalWinds}
          onChange={v => onChange({ totalWinds: v })}
        />
      </div>

      {/* Payout Logic */}
      <div className="ps-section">
        <div className="ps-section-label-row">
          <label className="ps-section-label">Payout Logic for Discarder</label>
          <Tooltip>
            <ul>
              <li><strong>Pays More</strong> — discarder pays double share; other losers pay single</li>
              <li><strong>Pays All</strong> — discarder covers the full payout; others pay nothing</li>
            </ul>
            <p>Self Draw is always equal pay regardless of this setting.</p>
          </Tooltip>
        </div>
        <SegmentedToggle
          options={[
            { value: 'discarderPaysMore', label: 'Pays More' },
            { value: 'discarderPaysAll',  label: 'Pays All'  },
          ]}
          value={settings.payoutMode}
          onChange={v => onChange({ payoutMode: v })}
        />
      </div>

      {/* Minimum Fan */}
      <div className="ps-section">
        <div className="ps-section-label-row">
          <label className="ps-section-label">Minimum Fan</label>
          <Tooltip>
            <ul>
              <li><strong>0</strong> — any hand wins (no minimum)</li>
              <li><strong>1</strong> — at least 1 fan required</li>
              <li><strong>3</strong> — standard HK Mahjong rule</li>
              <li><strong>5</strong> — high-scoring hands only</li>
            </ul>
          </Tooltip>
        </div>
        <SegmentedToggle
          options={[
            { value: 0, label: '0' },
            { value: 1, label: '1' },
            { value: 3, label: '3' },
            { value: 5, label: '5' },
          ]}
          value={settings.minimumFan}
          onChange={v => onChange({ minimumFan: v })}
        />
      </div>

      {/* Payout Multiplier & Currency */}
      <div className="ps-section">
        <div className="ps-section-label-row">
          <label className="ps-section-label">Multiplier &amp; Currency</label>
          <Tooltip>
            <p>Chip scores × multiplier = cash settlement shown at game end.</p>
            <p>e.g. <strong>×2 at ฿</strong> means each chip point = ฿2</p>
          </Tooltip>
        </div>
        <div className="ps-multiplier-row">
          <select
            className="ps-currency-select"
            value={settings.currency}
            onChange={e => onChange({ currency: e.target.value })}
          >
            <option value="฿">฿</option>
            <option value="$">$</option>
            <option value="RM">RM</option>
          </select>
          <input
            type="number"
            className="ps-multiplier-input"
            value={settings.multiplier}
            min={0}
            step={0.5}
            placeholder="1"
            onChange={e => {
              const v = parseFloat(e.target.value)
              onChange({ multiplier: isNaN(v) ? 1 : v })
            }}
          />
          <span className="ps-multiplier-label">per chip</span>
        </div>
      </div>
    </>
  )
}

// ─── Player Setup ─────────────────────────────────────────────────────────────
export default function PlayerSetup({
  playerCount,
  playerNames,
  players,
  gameSettings,
  hasActiveGame,
  onPlayerCountChange,
  onNameChange,
  onGameSettingsChange,
  onStartGame,
  onBackToGame,
}) {
  return (
    <div className="ps-page">
      <div className="ps-header">
        <h1 className="ps-title">Score Assistant</h1>
        <p className="ps-sub">Set up your game before you start playing.</p>
      </div>

      <div className="ps-card">
        {/* Player count toggle */}
        <div className="ps-section">
          <label className="ps-section-label">Number of players</label>
          <SegmentedToggle
            options={[
              { value: 3, label: '3 Players' },
              { value: 4, label: '4 Players' },
            ]}
            value={playerCount}
            onChange={onPlayerCountChange}
          />
        </div>

        {/* Player names */}
        <div className="ps-section">
          <label className="ps-section-label">Player names</label>
          <div className="ps-players">
            {players.map(player => (
              <PlayerNameInput
                key={player.id}
                player={player}
                value={playerNames[player.id]}
                onChange={name => onNameChange(player.id, name)}
              />
            ))}
          </div>
        </div>

        {/* Game Settings */}
        <GameSettingsPanel
          settings={gameSettings}
          onChange={onGameSettingsChange}
        />

        {/* Actions */}
        <div className="ps-actions">
          <button
            className="ps-start-btn"
            onClick={() => onStartGame(gameSettings)}
            type="button"
          >
            {hasActiveGame ? 'Restart Game' : 'Start Game'}
          </button>
          {hasActiveGame && (
            <button className="ps-back-btn" onClick={onBackToGame} type="button">
              Back to game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
