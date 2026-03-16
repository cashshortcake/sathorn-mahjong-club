import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Tiles from './pages/Tiles'
import Score from './pages/Score'

function App() {
  return (
    <BrowserRouter basename="/sathorn-mahjong-club">
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Nav />
        <Routes>
          <Route path="/"           element={<Home />}       />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/tiles"      element={<Tiles />}      />
          <Route path="/score"      element={<Score />}      />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App