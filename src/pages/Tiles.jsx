import TileDirectory from '../components/TileDirectory'

function Tiles() {
  return (
    <div>
      <h2 style={{ color: '#F7F3E8', marginBottom: '0.25rem' }}>Tile Directory</h2>
      <p style={{ color: '#E0F2EE', marginBottom: '1.5rem', fontSize: '14px' }}>
        Quick reference — all tiles at a glance
      </p>
      <TileDirectory />
    </div>
  )
}

export default Tiles