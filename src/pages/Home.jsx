import './Home.css'
import iconFlashcards from '../assets/icons/illustration-flashcards.svg'
import iconCheatsheet from '../assets/icons/illustration-cheatsheet.svg'
import iconScoring    from '../assets/icons/illustration-scoring.svg'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import BorderBox from '../components/BorderBox'
import Ticker from '../components/Ticker'  

const RULES = [
  {
    title: 'Goal of Mahjong',
    answer: (
      <>
        <p className="ac-p">Complete a winning hand of <strong>14 tiles</strong> made of 4 sets and 1 pair.</p>
        <p className="ac-label">A set can be:</p>
        <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Chow</strong> — three consecutive numbers in the same suit (e.g. 3-4-5 Bamboo)</li>
          <li className="ac-bullet"><strong>Pung</strong> — three identical tiles (e.g. Red Dragon × 3)</li>
        </ul>
        <div className="ac-hand">
          Set<br/>Set<br/>Set<br/>Set<br/>Pair
        </div>
      </>
    ),
  },
  {
    title: 'Tile Basics',
    answer: (
      <>
        <p className="ac-label">Suits — Characters (萬), Bamboo (條), Dots (筒)</p>
        <p className="ac-p">These tiles can form sequences (Chows):</p>
        <div className="ac-hand">
          2-3-4 Bamboo<br/>6-7-8 Characters
        </div>
        <p className="ac-label">Honours — Winds and Dragons</p>
        <p className="ac-p">Honour tiles <strong>cannot</strong> form sequences. They can only form sets of identical tiles:</p>
        <div className="ac-hand">
          East East East<br/>Red Dragon × 3
        </div>
      </>
    ),
  },
  {
    title: 'The Golden Rule',
    answer: (
      <>
        <div className="ac-highlight">
          "Runs stay in the same suit. Triplets can mix anything."
        </div>
        <div className="ac-diagram">
          <div className="ac-diagram-title">GOLDEN RULE</div>
          <div className="ac-diagram-grid">
            <div className="ac-diagram-col">
              <div className="ac-diagram-col-title">Sequences (Chows)</div>
              <div className="ac-diagram-row">3-4-5 Bamboo <span className="ac-win">✓</span></div>
              <div className="ac-diagram-row">6-7-8 Dots <span className="ac-win">✓</span></div>
              <div className="ac-diagram-row">3-4-5 mixed <span className="ac-lose">✗</span></div>
            </div>
            <div className="ac-diagram-col">
              <div className="ac-diagram-col-title">Triplets (Pungs)</div>
              <div className="ac-diagram-row">Red Red Red <span className="ac-win">✓</span></div>
              <div className="ac-diagram-row">East East East <span className="ac-win">✓</span></div>
              <div className="ac-diagram-row">7-7-7 Bamboo <span className="ac-win">✓</span></div>
            </div>
          </div>
          <div className="ac-diagram-footer">
            <div className="ac-diagram-footer-note">Runs stay in suits</div>
            <div className="ac-diagram-footer-note">Triples mix freely</div>
          </div>
        </div>
      </>
    ),
  },
  {
    title: 'Minimum 3 Points (3 Faan)',
    answer: (
      <>
        <p className="ac-p">A hand must score at least <strong>3 points</strong> to win.</p>
        <p className="ac-label">Easiest ways to reach 3 points:</p>
        <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Mixed One Suit (3 pts)</strong> — One suit plus any honour tiles</li>
          <li className="ac-bullet"><strong>All Pungs (3 pts)</strong> — Entirely triplets and a pair</li>
        </ul>
        <div className="ac-hand">
          222 Bamboo<br/>
          777 Characters<br/>
          Red Dragon Pung<br/>
          West Wind Pung<br/>
          Pair
        </div>
        <p className="ac-label">Key rules:</p>
        <ul className="ac-bullets">
          <li className="ac-bullet">2-3-4 Bamboo <span className="ac-win">✔</span></li>
          <li className="ac-bullet">2-3-4 Bamboo + Dragon <span className="ac-lose">✘</span></li>
          <li className="ac-bullet">Pungs can include any suit or honour tile <span className="ac-win">✔</span></li>
        </ul>
      </>
    ),
  },
  {
    title: 'What to Avoid — Chicken Hand',
    answer: (
      <>
        <p className="ac-p">A <strong>Chicken Hand</strong> is made only of sequences with no bonuses — it scores 0 points and cannot win in a 3-point minimum game.</p>
        <div className="ac-hand">
          2-3-4 Bamboo<br/>
          3-4-5 Dots<br/>
          6-7-8 Characters<br/>
          2-3-4 Characters<br/>
          Pair
        </div>
        <div className="ac-highlight">
          This hand scores 0 points — it cannot win.
        </div>
      </>
    ),
  },
]

function Home() {
  return (
    <div className="home">

      <section className="home-hero">
        <BorderBox>
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
        </BorderBox>
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

      <section className="home-tips">
        <h2 className="home-tips-title">Quick Tips</h2>
        <Accordion items={RULES} />
      </section>
    
    </div>
  )
}

export default Home