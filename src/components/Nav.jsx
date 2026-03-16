import { NavLink } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/',            label: 'Home'       },
  { to: '/flashcards',  label: 'Flashcards' },
  { to: '/tiles',       label: 'Tiles'      },
  { to: '/score',       label: 'Score'      },
]

function Nav() {
  return (
    <nav className="nav">
      {LINKS.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Nav