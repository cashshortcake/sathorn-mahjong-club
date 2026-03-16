import './TileDirectory.css'

import tiles from '../data/tiles'

const SUITS = [
    { id: 'wan',    label: 'Characters', labelZh: '萬', available: true,  optional: false },
    { id: 'tiao',   label: 'Bamboo',     labelZh: '條', available: true,  optional: false },
    { id: 'tong',   label: 'Circles',    labelZh: '筒', available: true,  optional: false },
    { id: 'wind',   label: 'Winds',      labelZh: '風', available: true,  optional: false },
    { id: 'honor',  label: 'Dragons',    labelZh: '龍', available: true,  optional: false },
    { id: 'flower', label: 'Flowers',    labelZh: '花', available: true,  optional: true  },
    { id: 'season', label: 'Seasons',    labelZh: '季', available: true,  optional: true  },
  ]

function TileDirectory() {
  return (
    <div className="directory">
      {SUITS.map(suit => {
        const suitTiles = tiles.filter(t => t.suit === suit.id)
        return (
          <div key={suit.id} className={`suit-row ${!suit.available ? 'unavailable' : ''}`}>
            <div className="suit-header">
              <span className="suit-header-en">{suit.label}</span>
              <span className="suit-header-zh">{suit.labelZh}</span>
              {suit.optional && <span className="badge optional">optional</span>}
              {!suit.available && <span className="badge coming">coming soon</span>}
            </div>
            <div className="tile-row">
              {suit.available ? (
                suitTiles.map(tile => (
                  <div key={tile.id} className="dir-tile">
                    <div className="dir-glyph">{tile.glyph}</div>
                    <div className="dir-label">{tile.dirLabel}</div>
                  </div>
                ))
              ) : (
                Array.from({ length: suit.id === 'pin' || suit.id === 'sou' ? 9 : 4 }).map((_, i) => (
                  <div key={i} className="dir-tile dim">
                    <div className="dir-glyph">?</div>
                    <div className="dir-label">{i + 1}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TileDirectory