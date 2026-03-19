import { MIN_FAN } from '../../utils/scoring'
import './StickyBottomBar.css'

export default function StickyBottomBar({ fanResult, round, isEndGame, onExpand }) {
  const { total } = fanResult

  return (
    <div className="sbb-bar" role="button" tabIndex={0} onClick={onExpand} onKeyDown={e => e.key === 'Enter' && onExpand()}>
      <div className="sbb-left">
        <span className="sbb-meta-label">Total Fan</span>
        <span className="sbb-fan-total">
          {isEndGame ? 'Game Over' : `${total} fan`}
        </span>
        {!isEndGame && total > 0 && total < MIN_FAN && (
          <span className="sbb-minfan-badge">Min {MIN_FAN} fan</span>
        )}
      </div>
      <div className="sbb-right">
        {!isEndGame && <span className="sbb-round-label">Round {round}</span>}
        <span className="sbb-expand-pill">Expand ↑</span>
      </div>
    </div>
  )
}
