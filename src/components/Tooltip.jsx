import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './Tooltip.css'

/**
 * Shared Tooltip component.
 * - Desktop: shows on hover
 * - Mobile / no-hover: shows on click, auto-dismisses after 4s
 * - Always rendered in a portal (body) so it's never clipped
 * - Always in viewport — flips below if near top edge, mirrors left if near right edge
 *
 * Usage (plain text):
 *   <Tooltip text="Some explanation" />
 *
 * Usage (rich content — bold, bullets, etc.):
 *   <Tooltip>
 *     <p>Description with <strong>bold</strong></p>
 *     <ul>
 *       <li>Point one</li>
 *       <li>Point two</li>
 *     </ul>
 *   </Tooltip>
 */
export default function Tooltip({ text, children }) {
  const [open,  setOpen]  = useState(false)
  const [style, setStyle] = useState({})

  const btnRef   = useRef(null)
  const timerRef = useRef(null)

  const TOOLTIP_W = 228  // px — matches CSS width
  const TOOLTIP_H = 120  // px — rough max height, used for flip calc

  // Update fixed position from button rect
  const reposition = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const vw   = window.innerWidth
    const vh   = window.innerHeight

    // Horizontal: try centred on button, clamp inside viewport
    let left = rect.left + rect.width / 2 - TOOLTIP_W / 2
    left = Math.max(8, Math.min(left, vw - TOOLTIP_W - 8))

    // Vertical: above by default; flip below if not enough room
    const aboveTop = rect.top - TOOLTIP_H - 10
    if (aboveTop < 8) {
      // Below
      setStyle({ top: rect.bottom + 8, left })
    } else {
      setStyle({ bottom: vh - rect.top + 8, left })
    }
  }, [])

  // Desktop: hover
  function handleMouseEnter() {
    reposition()
    setOpen(true)
  }
  function handleMouseLeave() {
    // Only close on mouse-leave if we're not in a click-open state
    clearTimeout(timerRef.current)
    setOpen(false)
  }

  // Mobile / click
  function handleClick(e) {
    e.stopPropagation()
    if (open) {
      clearTimeout(timerRef.current)
      setOpen(false)
    } else {
      reposition()
      setOpen(true)
      timerRef.current = setTimeout(() => setOpen(false), 4000)
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onOutside(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false)
        clearTimeout(timerRef.current)
      }
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const bubble = open
    ? createPortal(
        <div
          className={`tooltip-bubble ${style.bottom !== undefined ? 'tooltip-bubble--above' : 'tooltip-bubble--below'}`}
          style={style}
          role="tooltip"
        >
          {children || text}
        </div>,
        document.body
      )
    : null

  return (
    <span className="tooltip-wrap">
      <button
        ref={btnRef}
        type="button"
        className="tooltip-btn"
        aria-label="More info"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        ⓘ
      </button>
      {bubble}
    </span>
  )
}
