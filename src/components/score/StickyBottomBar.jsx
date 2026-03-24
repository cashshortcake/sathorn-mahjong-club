import './StickyBottomBar.css'

export default function StickyBottomBar({ fanResult, round, currentWind, isEndGame, minimumFan, onExpand }) {
  const { total } = fanResult
  const effectiveMin = minimumFan ?? 3

  const roundLabel = `${currentWind ?? 'East'} · R${round}`

  return (
    <div className="sbb-bar" role="button" tabIndex={0} onClick={onExpand} onKeyDown={e => e.key === 'Enter' && onExpand()}>
      <div className="sbb-left">
        <span className="sbb-meta-label">Total Fan</span>
        <span className="sbb-fan-total">
          {isEndGame ? 'Game Over' : `${total} fan`}
        </span>
        {!isEndGame && effectiveMin > 0 && total > 0 && total < effectiveMin && (
          <span className="sbb-minfan-badge">Min {effectiveMin} fan</span>
        )}
      </div>
      <div className="sbb-right">
        {!isEndGame && <span className="sbb-round-label">{roundLabel}</span>}
        <span className="sbb-expand-pill">Expand ↑</span>
      </div>
    </div>
  )
}
