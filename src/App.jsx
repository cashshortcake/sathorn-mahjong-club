import { useState } from 'react'
import TileCard from './components/TileCard'
import tiles from './data/tiles'

const FILTERS = ['All', 'Winds', 'Characters']

function App() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [learnedIds, setLearnedIds] = useState(new Set())

  const filteredTiles = tiles.filter(tile => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Winds') return tile.suit === 'wind'
    if (activeFilter === 'Characters') return tile.suit === 'man'
  })

  function toggleLearned(id) {
    setLearnedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      <h1 style={{ color: '#F7F3E8', marginBottom: '0.5rem' }}>
        Sathorn Mah Jong Club 🀄
      </h1>
      <p style={{ color: '#E0F2EE', marginBottom: '1.5rem', fontSize: '14px' }}>
        Tap a tile to reveal its name and mnemonic
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: activeFilter === filter ? '#F7F3E8' : '#4A7A65',
              background: activeFilter === filter ? '#F7F3E8' : 'transparent',
              color: activeFilter === filter ? '#1A1A1A' : '#F7F3E8',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {filter}
          </button>
        ))}

        <span style={{
          marginLeft: 'auto',
          color: '#E0F2EE',
          fontSize: '13px',
        }}>
          {learnedIds.size} / {tiles.length} learned
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        {filteredTiles.map(tile => (
          <TileCard
            key={tile.id}
            tile={tile}
            learned={learnedIds.has(tile.id)}
            onToggleLearned={toggleLearned}
          />
        ))}
      </div>

    </div>
  )
}

export default App