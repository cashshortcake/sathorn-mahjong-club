import footerTiles from '../assets/icons/Footer.svg'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <img src={footerTiles} alt="" className="footer-tiles" />
      <h2 className="footer-title">
        Designed to end Mahjong arguments… or start new ones.
      </h2>
      <p className="footer-year">2026</p>
    </footer>
  )
}

export default Footer