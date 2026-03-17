import { useState, useRef, useEffect } from 'react'
import './Accordion.css'

function AccordionItem({ title, children, isOpen, onToggle }) {
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setHeight(bodyRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <span className="accordion-title">{title}</span>
        <span className={`accordion-chevron ${isOpen ? 'up' : ''}`}>∨</span>
      </button>
      <div
        className="accordion-body-wrap"
        style={{ maxHeight: height, overflow: 'hidden', transition: 'max-height 0.35s ease' }}
      >
        <div ref={bodyRef} className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  )
}

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  function handleToggle(i) {
    setOpenIndex(prev => prev === i ? null : i)
  }

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          isOpen={openIndex === i}
          onToggle={() => handleToggle(i)}
        >
          {item.answer}
        </AccordionItem>
      ))}
    </div>
  )
}

export default Accordion