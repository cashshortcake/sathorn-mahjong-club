import { Link, NavLink } from 'react-router-dom'
import logoFull from '../assets/icons/Logo-full.svg'
import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <Link to="/">
        <img src={logoFull} alt="The Sathorn Mahjong Club" className="site-logo" />
      </Link>
      <nav className="site-nav">
        <NavLink
            to="/cheatsheet"
            className={({ isActive }) => isActive ? 'site-nav-link active-link' : 'site-nav-link'}
        >
            Cheatsheet
        </NavLink>
        <NavLink
            to="/flashcards"
            className={({ isActive }) => isActive ? 'site-nav-link active-link' : 'site-nav-link'}
        >
            Flashcards
        </NavLink>
        <NavLink
            to="/score"
            className={({ isActive }) => isActive ? 'site-nav-link active-link' : 'site-nav-link'}
        >
            Score Assistant
            </NavLink>
        </nav>
    </header>
  )
}

export default Header