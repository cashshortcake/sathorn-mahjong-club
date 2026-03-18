import footerTiles from '../assets/icons/Footer.svg'
import star1 from '../assets/icons/ticker-star-1.svg'
import { useFadeInOnScroll } from '../hooks/useFadeIn'
import './Footer.css'

function Footer() {
  const [ref, visible] = useFadeInOnScroll()

  return (
    <footer ref={ref} className={`site-footer fade-up delay-3 ${visible ? 'visible' : ''}`}>
      <div className="footer-squiggle" />
      <img src={footerTiles} alt="" className="footer-tiles" />
      <h2 className="footer-title">
        Designed to end Mahjong arguments… or start new ones.
      </h2>
      <p className="footer-copy">
        <img src={star1} alt="" className="footer-star" />
        Made with love (and mild frustration)
        <img src={star1} alt="" className="footer-star" />
      </p>
      <p className="footer-year">© 2026 Sathorn Mahjong Club</p>
    </footer>
  )
}

export default Footer