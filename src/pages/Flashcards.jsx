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

const RULES = [
    {
      title: 'Goal of Mahjong',
      answer: (
        <>
          <p className="ac-p">Complete a winning hand of <strong>14 tiles</strong> made of 4 sets and 1 pair.</p>
          <p className="ac-label">A set can be:</p>
          <ul className="ac-bullets">
            <li className="ac-bullet"><strong>Chow</strong> — three consecutive numbers in the same suit (e.g. 3-4-5 Bamboo)</li>
            <li className="ac-bullet"><strong>Pung</strong> — three identical tiles (e.g. Red Dragon × 3)</li>
          </ul>
          <div className="ac-hand">
            Set<br/>Set<br/>Set<br/>Set<br/>Pair
          </div>
        </>
      ),
    },
    {
      title: 'Tile Basics',
      answer: (
        <>
          <p className="ac-label">Suits — Characters (萬), Bamboo (條), Dots (筒)</p>
          <p className="ac-p">These tiles can form sequences (Chows):</p>
          <div className="ac-hand">
            2-3-4 Bamboo<br/>6-7-8 Characters
          </div>
          <p className="ac-label">Honours — Winds and Dragons</p>
          <p className="ac-p">Honour tiles <strong>cannot</strong> form sequences. They can only form sets of identical tiles:</p>
          <div className="ac-hand">
            East East East<br/>Red Dragon × 3
          </div>
        </>
      ),
    },
    {
      title: 'The Golden Rule',
      answer: (
        <>
          <div className="ac-highlight">
            "Runs stay in the same suit. Triplets can mix anything."
          </div>
          <div className="ac-diagram">
            <div className="ac-diagram-title">GOLDEN RULE</div>
            <div className="ac-diagram-grid">
              <div className="ac-diagram-col">
                <div className="ac-diagram-col-title">Sequences (Chows)</div>
                <div className="ac-diagram-row">3-4-5 Bamboo <span className="ac-win">✓</span></div>
                <div className="ac-diagram-row">6-7-8 Dots <span className="ac-win">✓</span></div>
                <div className="ac-diagram-row">3-4-5 mixed <span className="ac-lose">✗</span></div>
              </div>
              <div className="ac-diagram-col">
                <div className="ac-diagram-col-title">Triplets (Pungs)</div>
                <div className="ac-diagram-row">Red Red Red <span className="ac-win">✓</span></div>
                <div className="ac-diagram-row">East East East <span className="ac-win">✓</span></div>
                <div className="ac-diagram-row">7-7-7 Bamboo <span className="ac-win">✓</span></div>
              </div>
            </div>
            <div className="ac-diagram-footer">
              <div className="ac-diagram-footer-note">Runs stay in suits</div>
              <div className="ac-diagram-footer-note">Triples mix freely</div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Minimum 3 Points (3 Faan)',
      answer: (
        <>
          <p className="ac-p">A hand must score at least <strong>3 points</strong> to win.</p>
          <p className="ac-label">Easiest ways to reach 3 points:</p>
          <ul className="ac-bullets">
            <li className="ac-bullet"><strong>Mixed One Suit (3 pts)</strong> — One suit plus any honour tiles</li>
            <li className="ac-bullet"><strong>All Pungs (3 pts)</strong> — Entirely triplets and a pair</li>
          </ul>
          <div className="ac-hand">
            222 Bamboo<br/>
            777 Characters<br/>
            Red Dragon Pung<br/>
            West Wind Pung<br/>
            Pair
          </div>
          <p className="ac-label">Key rules:</p>
          <ul className="ac-bullets">
            <li className="ac-bullet">2-3-4 Bamboo <span className="ac-win">✔</span></li>
            <li className="ac-bullet">2-3-4 Bamboo + Dragon <span className="ac-lose">✘</span></li>
            <li className="ac-bullet">Pungs can include any suit or honour tile <span className="ac-win">✔</span></li>
          </ul>
        </>
      ),
    },
    {
      title: 'What to Avoid — Chicken Hand',
      answer: (
        <>
          <p className="ac-p">A <strong>Chicken Hand</strong> is made only of sequences with no bonuses — it scores 0 points and cannot win in a 3-point minimum game.</p>
          <div className="ac-hand">
            2-3-4 Bamboo<br/>
            3-4-5 Dots<br/>
            6-7-8 Characters<br/>
            2-3-4 Characters<br/>
            Pair
          </div>
          <div className="ac-highlight">
            This hand scores 0 points — it cannot win.
          </div>
        </>
      ),
    },
  ]

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

      <div className="fc-rules">
        <h2 className="fc-rules-title">Rules</h2>
        <Accordion items={RULES} />
      </div>

    </div>
  )
}

export default Flashcards