import { useState, useMemo } from 'react'
import BorderBox from '../components/BorderBox'
import Accordion from '../components/Accordion'
import tiles from '../data/tiles'
import './Flashcards.css'

import cardFront from '../assets/icons/card-front.svg'
import cardBack  from '../assets/icons/card-back.svg'

import windEast  from '../assets/tiles/wind-east.svg'
import windSouth from '../assets/tiles/wind-south.svg'
import windWest  from '../assets/tiles/wind-west.svg'
import windNorth from '../assets/tiles/wind-north.svg'
import wan1 from '../assets/tiles/wan-1.svg'
import wan2 from '../assets/tiles/wan-2.svg'
import wan3 from '../assets/tiles/wan-3.svg'
import wan4 from '../assets/tiles/wan-4.svg'
import wan5 from '../assets/tiles/wan-5.svg'
import wan6 from '../assets/tiles/wan-6.svg'
import wan7 from '../assets/tiles/wan-7.svg'
import wan8 from '../assets/tiles/wan-8.svg'
import wan9 from '../assets/tiles/wan-9.svg'

const TILE_SVGS = {
    east: windEast, south: windSouth, west: windWest, north: windNorth,
    wan1, wan2, wan3, wan4, wan5, wan6, wan7, wan8, wan9,
  }
  
const FILTERS = ['All', 'Winds', 'Characters']

function Flashcards() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filteredTiles = useMemo(() => {
    return tiles.filter(tile => {
      if (activeFilter === 'All') return tile.suit === 'wind' || tile.suit === 'wan'
      if (activeFilter === 'Winds') return tile.suit === 'wind'
      if (activeFilter === 'Characters') return tile.suit === 'wan'
    })
  }, [activeFilter])

  function handleFilter(filter) {
    setActiveFilter(filter)
    setCurrentIndex(0)
    setFlipped(false)
  }

  function handleNext() {
    setCurrentIndex(i => Math.min(i + 1, filteredTiles.length - 1))
    setFlipped(false)
  }

  function handleLast() {
    setCurrentIndex(i => Math.max(i - 1, 0))
    setFlipped(false)
  }

  const tile = filteredTiles[currentIndex]
  const tileSvg = tile ? TILE_SVGS[tile.id] : null

  return (
    <div className="fc-page">
      <h1 className="fc-title">Flashcards</h1>

      <BorderBox>
        <div className="fc-inner">

          <div className="fc-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`fc-filter-btn ${activeFilter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div
            className={`fc-card-scene ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="fc-card-inner">

              <div className="fc-face fc-face-front">
                <img src={cardFront} alt="" className="fc-card-bg" />
                <div className="fc-front-content">
                  {tileSvg && (
                    <img src={tileSvg} alt={tile?.name} className="fc-tile-svg" />
                  )}
                  <p className="fc-tap-hint">Tap to reveal</p>
                </div>
              </div>

              <div className="fc-face fc-face-back">
                <img src={cardBack} alt="" className="fc-card-bg" />
                <div className="fc-back-content">
                  <div className="fc-back-top">
                    <div className="fc-chinese">{tile?.chinese}</div>
                    <div className="fc-name">{tile?.name}</div>
                    <div className="fc-pinyin">{tile?.pinyin}</div>
                  </div>
                  <div className="fc-back-bottom">
                    <p className="fc-mnemonic">{tile?.mnemonic}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="fc-pagination">
            <button
              className="fc-page-btn"
              onClick={handleLast}
              disabled={currentIndex === 0}
            >
              ← Last
            </button>
            <span className="fc-counter">
              {currentIndex + 1} out of {filteredTiles.length}
            </span>
            <button
              className="fc-page-btn"
              onClick={handleNext}
              disabled={currentIndex === filteredTiles.length - 1}
            >
              Next →
            </button>
          </div>

        </div>
      </BorderBox>

    </div>
  )
}

export default Flashcards