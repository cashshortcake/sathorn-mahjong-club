import footerTiles from '../assets/icons/Footer.svg'
import { useFadeInOnScroll } from '../hooks/useFadeIn'
import './Footer.css'

function Footer() {
  const [ref, visible] = useFadeInOnScroll()

  return (
    <footer ref={ref} className={`site-footer fade-up delay-3 ${visible ? 'visible' : ''}`}>
      <img src={footerTiles} alt="" className="footer-tiles" />
      <h2 className="footer-title">
        Designed to end Mahjong arguments… or start new ones.
      </h2>
      <p className="footer-year">2026</p>
    </footer>
  )
}

export default Footer