import './PlayerSetup.css'

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

function PlayerNameInput({ player, value, onChange }) {
  function handleBlur(e) {
    const trimmed = e.target.value.trim()
    onChange(trimmed || player.defaultName)
  }

  return (
    <div className="ps-player-row">
      <span
        className="ps-player-icon player-ticker-star"
        style={{
          '--player-color': player.color,
          '--player-icon-url': `url(${player.icon})`,
        }}
        aria-hidden
      />
      <span className="ps-player-prefix">P{player.id}</span>
      <input
        type="text"
        className="ps-name-input"
        value={value}
        placeholder={player.defaultName}
        onChange={e => onChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={e => e.target.select()}
        maxLength={24}
      />
    </div>
  )
}

export default function PlayerSetup({
  playerCount,
  playerNames,
  players,
  hasActiveGame,
  onPlayerCountChange,
  onNameChange,
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
                value={playerNames[player.id] || player.defaultName}
                onChange={name => onNameChange(player.id, name)}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="ps-actions">
          <button className="ps-start-btn" onClick={onStartGame} type="button">
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
