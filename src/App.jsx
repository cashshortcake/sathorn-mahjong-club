import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Cheatsheet from './pages/Cheatsheet'
import Score from './pages/Score'

function App() {
  return (
    <BrowserRouter basename="/sathorn-mahjong-club">
      <div className="squiggle" />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <Routes>
          <Route path="/"           element={<Home />}       />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/cheatsheet" element={<Cheatsheet />} />
          <Route path="/score"      element={<Score />}      />
        </Routes>
      </main>
      <div className="squiggle" />
    </BrowserRouter>
  )
}

export default App