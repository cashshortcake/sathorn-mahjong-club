import { useState } from 'react'
import './TileCard.css'

function TileCard({ tile, learned, onToggleLearned }) {
  const [flipped, setFlipped] = useState(false)

  function handleMarkLearned(e) {
    e.stopPropagation()
    onToggleLearned(tile.id)
  }

  return (
    <div
      className={`card-wrap ${flipped ? 'flipped' : ''} ${learned ? 'learned' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="card-inner">
        <div className="card-face card-front">
          <div className="learned-dot" />
          <div className="tile-glyph">{tile.glyph}</div>
          {tile.num !== null && (
            <div className="tile-num">{tile.num}</div>
          )}
          <div className="suit-band">{tile.suitLabel}</div>
        </div>
        <div className="card-face card-back">
          <div className="learned-dot" />
          <div className="tile-chinese">{tile.chinese}</div>
          <div className="tile-name">{tile.name}</div>
          <div className="tile-pinyin">{tile.pinyin}</div>
          <div className="tile-mnemonic">{tile.mnemonic}</div>
          <button
            className="mark-btn"
            onClick={handleMarkLearned}
          >
            {learned ? 'Unmark' : 'Mark learned'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TileCard