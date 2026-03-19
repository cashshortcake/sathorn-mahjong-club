import { MAX_FAN } from '../../utils/scoring'
import './StickyBottomBar.css'

export default function StickyBottomBar({ fanResult, isEndGame, onExpand }) {
  const { items, total } = fanResult

  const summaryItems = items.filter(i => !i.strikethrough).slice(0, 3)
  const more = items.filter(i => !i.strikethrough).length - 3

  return (
    <div className="sbb-bar" role="button" tabIndex={0} onClick={onExpand} onKeyDown={e => e.key === 'Enter' && onExpand()}>
      <div className="sbb-left">
        <span className="sbb-fan-total">
          {isEndGame ? 'Game Over' : `${total} fan`}
        </span>
        {!isEndGame && items.length > 0 && (
          <span className="sbb-summary">
            {summaryItems.map(i => i.label).join(' · ')}
            {more > 0 && ` +${more} more`}
          </span>
        )}
        {!isEndGame && items.length === 0 && (
          <span className="sbb-summary">Tap to open scoring panel</span>
        )}
      </div>
      <div className="sbb-right">
        {total >= MAX_FAN && !isEndGame && (
          <span className="sbb-max-badge">Max</span>
        )}
        <span className="sbb-expand">↑</span>
      </div>
    </div>
  )
}
