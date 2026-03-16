import { NavLink } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/',            label: 'Home'            },
  { to: '/flashcards',  label: 'Flashcards'      },
  { to: '/cheatsheet',  label: 'Cheatsheet'      },
  { to: '/score',       label: 'Score Assistant' },
]

function Nav() {
  return (
    <header className="nav-header">
      <nav className="nav-inner">
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Nav