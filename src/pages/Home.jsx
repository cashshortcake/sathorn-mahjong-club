import './Home.css'
import iconFlashcards from '../assets/icons/illustration-flashcards.svg'
import iconCheatsheet from '../assets/icons/illustration-cheatsheet.svg'
import iconScoring from '../assets/icons/illustration-scoring.svg'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">

      <section className="home-hero">
        <div className="hero-box">
          <h1 className="hero-title">
            Learn Mahjong. Count Points. End Arguments.
          </h1>
          <p className="hero-body">
            A small toolkit to help our table learn tiles faster, count points
            correctly, and settle scoring disputes.
          </p>
          <p className="hero-body">
            Built after one too many games that ended with:<br />
            <em>"Wait… wait… wait… let me recount."</em>
          </p>
        </div>
      </section>

      <section className="home-tools">
        <div className="tool-card">
          <img src={iconFlashcards} alt="Flashcards" className="tool-icon" />
          <Link to="/flashcards" className="tool-label">Flashcards</Link>
          <p className="tool-desc">Master tiles, hands, and rules</p>
        </div>
        <div className="tool-card">
          <img src={iconCheatsheet} alt="Cheatsheet" className="tool-icon" />
          <Link to="/cheatsheet" className="tool-label">Cheatsheet</Link>
          <p className="tool-desc">Quick reference for all 144 tiles</p>
        </div>
        <div className="tool-card">
          <img src={iconScoring} alt="Scoring" className="tool-icon" />
          <Link to="/score" className="tool-label">Score Assistant</Link>
          <p className="tool-desc">Calculate hand values</p>
        </div>
      </section>

    </div>
  )
}

export default Home