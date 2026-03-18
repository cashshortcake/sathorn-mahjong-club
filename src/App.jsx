import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Cheatsheet from './pages/Cheatsheet'
import Score from './pages/Score'
import { useFadeIn } from './hooks/useFadeIn'
import './App.css'

function AnimatedMain() {
  const [, mainVisible] = useFadeIn()

  return (
    <main className={`site-main fade-up delay-2 ${mainVisible ? 'visible' : ''}`}>
      <Routes>
        <Route path="/"           element={<Home />}       />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/cheatsheet" element={<Cheatsheet />} />
        <Route path="/score"      element={<Score />}      />
      </Routes>
    </main>
  )
}

function AppContent() {
  const location = useLocation()

  return (
    <>
      <div className="squiggle" />
      <Header />
      <AnimatedMain key={location.pathname} />
      <Footer />
      <div className="squiggle" />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename="/sathorn-mahjong-club">
      <AppContent />
    </BrowserRouter>
  )
}

export default App