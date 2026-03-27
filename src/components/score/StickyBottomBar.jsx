import './StickyBottomBar.css'

export default function StickyBottomBar({ fanResult, round, totalRounds, isEndGame, minimumFan, onExpand }) {
  const { total } = fanResult
  const effectiveMin = minimumFan ?? 3

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
        {!isEndGame && (
          <span className="sbb-round-label">R{round}/{totalRounds}</span>
        )}
        <span className="sbb-expand-pill">Expand ↑</span>
      </div>
    </div>
  )
}
