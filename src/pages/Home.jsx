import './Home.css'
import iconFlashcards from '../assets/icons/illustration-flashcards.svg'
import iconCheatsheet from '../assets/icons/illustration-cheatsheet.svg'
import iconScoring    from '../assets/icons/illustration-scoring.svg'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import BorderBox from '../components/BorderBox'
import Ticker from '../components/Ticker'

// ─── Tiles ────────────────────────────────────────────────────────────────────
import tiao1 from '../assets/tiles/tiao-1.svg'
import tiao2 from '../assets/tiles/tiao-2.svg'
import tiao3 from '../assets/tiles/tiao-3.svg'
import tiao4 from '../assets/tiles/tiao-4.svg'
import tiao5 from '../assets/tiles/tiao-5.svg'
import tiao6 from '../assets/tiles/tiao-6.svg'
import tiao7 from '../assets/tiles/tiao-7.svg'
import tiao8 from '../assets/tiles/tiao-8.svg'
import tiao9 from '../assets/tiles/tiao-9.svg'

import tong1 from '../assets/tiles/tong-1.svg'
import tong2 from '../assets/tiles/tong-2.svg'
import tong3 from '../assets/tiles/tong-3.svg'
import tong4 from '../assets/tiles/tong-4.svg'
import tong5 from '../assets/tiles/tong-5.svg'
import tong6 from '../assets/tiles/tong-6.svg'
import tong7 from '../assets/tiles/tong-7.svg'
import tong8 from '../assets/tiles/tong-8.svg'
import tong9 from '../assets/tiles/tong-9.svg'

import wan1 from '../assets/tiles/wan-1.svg'
import wan2 from '../assets/tiles/wan-2.svg'
import wan3 from '../assets/tiles/wan-3.svg'
import wan4 from '../assets/tiles/wan-4.svg'
import wan5 from '../assets/tiles/wan-5.svg'
import wan6 from '../assets/tiles/wan-6.svg'
import wan7 from '../assets/tiles/wan-7.svg'
import wan8 from '../assets/tiles/wan-8.svg'
import wan9 from '../assets/tiles/wan-9.svg'

import windEast  from '../assets/tiles/wind-east.svg'
import windWest  from '../assets/tiles/wind-west.svg'
import windNorth from '../assets/tiles/wind-north.svg'
import windSouth from '../assets/tiles/wind-south.svg'

import honorRed   from '../assets/tiles/honor-red.svg'
import honorGreen from '../assets/tiles/honor-green.svg'
import honorWhite from '../assets/tiles/honor-white.svg'

import flower1Red   from '../assets/tiles/flower-1-red.svg'
import flower2Red   from '../assets/tiles/flower-2-red.svg'
import flower3Red   from '../assets/tiles/flower-3-red.svg'
import flower4Red   from '../assets/tiles/flower-4-red.svg'
import flower1Black from '../assets/tiles/flower-1-black.svg'
import flower2Black from '../assets/tiles/flower-2-black.svg'
import flower3Black from '../assets/tiles/flower-3-black.svg'
import flower4Black from '../assets/tiles/flower-4-black.svg'

// ─── TileSVG ──────────────────────────────────────────────────────────────────
function TileSVG({ src, alt = '', faded = false }) {
  return (
    <img
      src={src}
      alt={alt}
      className={['ac-tile-svg', faded ? 'ac-tile-svg--faded' : ''].filter(Boolean).join(' ')}
    />
  )
}

// ─── TileGroup ────────────────────────────────────────────────────────────────
function TileGroup({ children, label }) {
  return (
    <div className="ac-tile-group">
      <div className="ac-tile-group-tiles">{children}</div>
      {label && <span className="ac-tile-group-label">{label}</span>}
    </div>
  )
}

// ─── Rules ────────────────────────────────────────────────────────────────────
const RULES = [
  {
    title: 'Goal of Mahjong',
    answer: (
      <>
        <p className="ac-p">Complete a winning hand of <i>14 tiles</i> made of <strong>4 sets</strong> and <strong>1 pair</strong>.</p>
        <p className="ac-label">A set can be:</p>

       {/* Chow (Sequence) Set */}
        <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Chow (Sequence) Set</strong>: Any suited tiles in a consecutive order</li>
        </ul> 
          <div className="ac-hand">
              <ul class="ac-bullets">
                <p>1-2-3 Bamboo <span className="ac-win">✔</span></p>
                <p>5-5-5 Bamboo <span className="ac-lose">✘</span></p>
              </ul>
          </div>

          {/* Pung (Triplet) Set */}
          <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Pung (Triplet) Set</strong>: Any 3 identical suites/honor tiles</li>
          </ul>
            <div className="ac-hand">
              <ul className="ac-bullets">
              <p>2-2-2-2 Bamboo <span className="ac-win">✔</span></p>
              <p>2-3-4-5 Bamboo <span className="ac-lose">✘</span></p>
            </ul>
          </div>

          {/* Kong Set */}
          <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Kong (4-of-a-kind) Set</strong>: Any 4 identical suites/honor tiles</li>
          </ul>
          <div className="ac-hand">
            <ul className="ac-bullets">
              <p>2-2-2-2 Bamboo <span className="ac-win">✔</span></p>
              <p>2-3-4-5 Bamboo <span className="ac-lose">✘</span></p>
            </ul>
          </div>

          {/* Pair Set */}
          <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Pair</strong>: Any 2 identical suites/honor tiles</li>
        </ul>
        <div className="ac-hand">
          <ul className="ac-bullets">
            <p>Dragon x 2 <span className="ac-win">✔</span></p>
            <p>2 Dots x 2 <span className="ac-win">✔</span></p>
          </ul>
        </div>

        <p className="ac-label">Action Priority (Who takes the Tile)</p>
        <p className="ac-p">If a player discards a tile, the following priority rules apply for claiming it:</p>
        <ul className="ac-bullets">
          <li className="ac-bullet"><strong>Wu (Win/Mahjong)</strong>: The highest priority. A player declaring a win (Completing a winning hand) takes the tile regardless of who else wants it.</li>
          <li className="ac-bullet"><strong>Kong/Pung (4-of-a-kind/Triplet)</strong>: If no one wins, a Pung (3 identical tiles) or Kong (4 identical tiles) takes precedence over a Chow.</li>
          <li className="ac-bullet"><strong>Chow (Sequence)</strong>: The lowest priority. The lowest priority. Only the player immediately to the right of the discarder can call a Chow. </li>
          </ul>
      </>
    ),
  },
  {
    title: 'Tile Basics',
    answer: (
      <>
        <p className="ac-label">Suits: Characters (萬), Bamboo (條), Dots (筒)</p>
        <p className="ac-p">These tiles can form 1: sequences (Chows) and 2: sets (Pungs and Kongs)</p>
        <div className="ac-hand">
          <div className="ac-tile-row">
            <TileGroup label="6-7-8 Bamboo (Chow)">
              <TileSVG src={tiao6} alt="6 Bamboo" />
              <TileSVG src={tiao7} alt="7 Bamboo" />
              <TileSVG src={tiao8} alt="8 Bamboo" />
            </TileGroup>

            <TileGroup label="6-6-6 Wan (Pung)">
              <TileSVG src={wan6} alt="6 Wan" />
              <TileSVG src={wan6} alt="6 Wan" />
              <TileSVG src={wan6} alt="6 Wan" />
            </TileGroup>

            <TileGroup label="2-2-2-2 Dots (Kong)">
              <TileSVG src={tong2} alt="2 Dots" />
              <TileSVG src={tong2} alt="2 Dots" />
              <TileSVG src={tong2} alt="2 Dots" />
              <TileSVG src={tong2} alt="2 Dots" />
            </TileGroup>
            </div>
        </div>
        <p className="ac-label">Honours: Winds and Dragons</p>
        <p className="ac-p">Honour tiles <strong>cannot</strong> form sequences. They can only form sets of identical tiles:</p>
        <div className="ac-hand">
          <div className="ac-tile-row">
            <TileGroup label="Jade Dragon (Pung)">
              <TileSVG src={honorGreen} alt="Jade Dragon" />
              <TileSVG src={honorGreen} alt="Jade Dragon" />
              <TileSVG src={honorGreen} alt="Jade Dragon" />
            </TileGroup>

            <TileGroup label="East Wind (Pair)">
              <TileSVG src={windEast} alt="East Wind" />
              <TileSVG src={windEast} alt="East Wind" />
            </TileGroup>
            </div>
        </div>
        <p className="ac-label">FLOWERS & BONUSES:</p>
        <p className="ac-p">Flowers provide additional points but only if they are in your <strong>seat</strong> form sequences. They can are <strong>not used to complete a hand.</strong></p>
        <div className="ac-hand">
        <div className="ac-tile-row">
            <TileGroup label="Flowers">
              <TileSVG src={flower1Black} alt="Flower 1 Black" />
              <TileSVG src={flower2Black} alt="Flower 2 Black" />
              <TileSVG src={flower3Black} alt="Flower 3 Black" />
              <TileSVG src={flower4Black} alt="Flower 4 Black" />
            </TileGroup>
            </div>
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
        <div className="ac-hand">
 
          {/* Valid sequences — same suit */}
          <div className="ac-tile-row">
            <TileGroup label="✓ 3-4-5 Bamboo">
              <TileSVG src={tiao3} alt="3 Bamboo" />
              <TileSVG src={tiao4} alt="4 Bamboo" />
              <TileSVG src={tiao5} alt="5 Bamboo" />
            </TileGroup>
 
            <TileGroup label="✓ 6-7-8 Dots">
              <TileSVG src={tong6} alt="6 Dots" />
              <TileSVG src={tong7} alt="7 Dots" />
              <TileSVG src={tong8} alt="8 Dots" />
            </TileGroup>
 
            <TileGroup label="✗ Mixed suits">
              <TileSVG src={tiao3} alt="3 Bamboo"     faded />
              <TileSVG src={wan4}  alt="4 Characters" faded />
              <TileSVG src={tong5} alt="5 Dots"       faded />
            </TileGroup>
          </div>
 
          {/* Valid triplets — anything goes */}
          <div className="ac-tile-row">
            <TileGroup label="✓ Dragon Pung">
              <TileSVG src={honorRed} alt="Red Dragon" />
              <TileSVG src={honorRed} alt="Red Dragon" />
              <TileSVG src={honorRed} alt="Red Dragon" />
            </TileGroup>
 
            <TileGroup label="✓ Wind Pung">
              <TileSVG src={windEast} alt="East Wind" />
              <TileSVG src={windEast} alt="East Wind" />
              <TileSVG src={windEast} alt="East Wind" />
            </TileGroup>
 
            <TileGroup label="✓ Bamboo Pung">
              <TileSVG src={tiao7} alt="7 Bamboo" />
              <TileSVG src={tiao7} alt="7 Bamboo" />
              <TileSVG src={tiao7} alt="7 Bamboo" />
            </TileGroup>
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
          <li className="ac-bullet"><strong>Mixed One Suit (3 pts)</strong>: One suit plus any honour tiles</li>
        </ul>

        {/* Mixed one suit */}
        <div className="ac-hand">
          <div className="ac-tile-row">
            <TileGroup label="1-2-3 Dots (Chow)">
              <TileSVG src={tong1} alt="1 Dot" />
              <TileSVG src={tong2} alt="2 Dot" />
              <TileSVG src={tong3} alt="3 Dot" />
            </TileGroup>
            <TileGroup label="4-5-6 Dots (Chow)">
              <TileSVG src={tong4} alt="4 Dot" />
              <TileSVG src={tong5} alt="5 Dot" />
              <TileSVG src={tong6} alt="6 Dot" />
            </TileGroup>
            <TileGroup label="7-8-9 Dots (Chow)">
              <TileSVG src={tong7} alt="7 Dot" />
              <TileSVG src={tong8} alt="8 Dot" />
              <TileSVG src={tong9} alt="9 Dot" />
            </TileGroup>
            <TileGroup label="9-9-9 Dots (Pung)">
              <TileSVG src={tong9} alt="9 Dot" />
              <TileSVG src={tong9} alt="9 Dot" />
              <TileSVG src={tong9} alt="9 Dot" />
            </TileGroup>
            <TileGroup label="Dragon (Pair)">
              <TileSVG src={honorRed} alt="Red Dragon" />
              <TileSVG src={honorRed} alt="Red Dragon" />
            </TileGroup>
          </div>
        </div>
        
        <ul classname="ac-bullets">  
          <li className="ac-bullet"><strong>All Pungs (3 pts)</strong>: Entirely triplets and a pair</li>
        </ul>

        {/* All pungs — anything goes */}
        <div className="ac-hand">
          <div className="ac-tile-row">
            <TileGroup label="Bamboo (Pung)">
              <TileSVG src={tiao2} alt="2 Bamboo" />
              <TileSVG src={tiao2} alt="2 Bamboo" />
              <TileSVG src={tiao2} alt="2 Bamboo" />
            </TileGroup>
            <TileGroup label="Wan (Pung)">
              <TileSVG src={wan7} alt="7 Characters" />
              <TileSVG src={wan7} alt="7 Characters" />
              <TileSVG src={wan7} alt="7 Characters" />
            </TileGroup>
            <TileGroup label="Dragon (Pung)">
              <TileSVG src={honorRed} alt="Red Dragon" />
              <TileSVG src={honorRed} alt="Red Dragon" />
              <TileSVG src={honorRed} alt="Red Dragon" />
            </TileGroup>
            <TileGroup label="Wind (Pung)">
              <TileSVG src={windWest} alt="West Wind" />
              <TileSVG src={windWest} alt="West Wind" />
              <TileSVG src={windWest} alt="West Wind" />
            </TileGroup>
            <TileGroup label="Dots (Pair)">
              <TileSVG src={tong5} alt="5 Dots" />
              <TileSVG src={tong5} alt="5 Dots" />
            </TileGroup>
          </div>
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