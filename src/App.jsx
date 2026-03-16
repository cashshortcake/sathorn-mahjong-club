import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Cheatsheet from './pages/Cheatsheet'
import Score from './pages/Score'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/sathorn-mahjong-club">
      <div className="squiggle" />
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/"           element={<Home />}       />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/cheatsheet" element={<Cheatsheet />} />
          <Route path="/score"      element={<Score />}      />
        </Routes>
      </main>
      <Footer />
      <div className="squiggle" />
    </BrowserRouter>
  )
}

export default App