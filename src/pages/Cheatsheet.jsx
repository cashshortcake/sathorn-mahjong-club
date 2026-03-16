import './Cheatsheet.css'
import pattern from '../assets/icons/pattern-cheatsheet.png'

// ── Tile imports — Wan (Characters) ──────────────────────
import wan1 from '../assets/tiles/wan-1.svg'
import wan2 from '../assets/tiles/wan-2.svg'
import wan3 from '../assets/tiles/wan-3.svg'
import wan4 from '../assets/tiles/wan-4.svg'
import wan5 from '../assets/tiles/wan-5.svg'
import wan6 from '../assets/tiles/wan-6.svg'
import wan7 from '../assets/tiles/wan-7.svg'
import wan8 from '../assets/tiles/wan-8.svg'
import wan9 from '../assets/tiles/wan-9.svg'

// ── Tile imports — Tiao (Bamboo) ─────────────────────────
import tiao1 from '../assets/tiles/tiao-1.svg'
import tiao2 from '../assets/tiles/tiao-2.svg'
import tiao3 from '../assets/tiles/tiao-3.svg'
import tiao4 from '../assets/tiles/tiao-4.svg'
import tiao5 from '../assets/tiles/tiao-5.svg'
import tiao6 from '../assets/tiles/tiao-6.svg'
import tiao7 from '../assets/tiles/tiao-7.svg'
import tiao8 from '../assets/tiles/tiao-8.svg'
import tiao9 from '../assets/tiles/tiao-9.svg'

// ── Tile imports — Tong (Circles) ────────────────────────
import tong1 from '../assets/tiles/tong-1.svg'
import tong2 from '../assets/tiles/tong-2.svg'
import tong3 from '../assets/tiles/tong-3.svg'
import tong4 from '../assets/tiles/tong-4.svg'
import tong5 from '../assets/tiles/tong-5.svg'
import tong6 from '../assets/tiles/tong-6.svg'
import tong7 from '../assets/tiles/tong-7.svg'
import tong8 from '../assets/tiles/tong-8.svg'
import tong9 from '../assets/tiles/tong-9.svg'

// ── Tile imports — Winds ─────────────────────────────────
import windEast  from '../assets/tiles/wind-east.svg'
import windSouth from '../assets/tiles/wind-south.svg'
import windWest  from '../assets/tiles/wind-west.svg'
import windNorth from '../assets/tiles/wind-north.svg'

// ── Tile imports — Dragons ───────────────────────────────
import honorRed   from '../assets/tiles/honor-red.svg'
import honorGreen from '../assets/tiles/honor-green.svg'
import honorWhite from '../assets/tiles/honor-white.svg'

// ── Tile imports — Flowers ───────────────────────────────
import flower1r from '../assets/tiles/flower-1-red.svg'
import flower1b from '../assets/tiles/flower-1-black.svg'
import flower2r from '../assets/tiles/flower-2-red.svg'
import flower2b from '../assets/tiles/flower-2-black.svg'
import flower3r from '../assets/tiles/flower-3-red.svg'
import flower3b from '../assets/tiles/flower-3-black.svg'
import flower4r from '../assets/tiles/flower-4-red.svg'
import flower4b from '../assets/tiles/flower-4-black.svg'

const WAN   = [wan1,wan2,wan3,wan4,wan5,wan6,wan7,wan8,wan9]
const TIAO  = [tiao1,tiao2,tiao3,tiao4,tiao5,tiao6,tiao7,tiao8,tiao9]
const TONG  = [tong1,tong2,tong3,tong4,tong5,tong6,tong7,tong8,tong9]
const WINDS = [
  { src: windEast,  label: 'East',  zh: '東' },
  { src: windSouth, label: 'South', zh: '南' },
  { src: windWest,  label: 'West',  zh: '西' },
  { src: windNorth, label: 'North', zh: '北' },
]
const DRAGONS = [
  { src: honorRed,   label: 'Ruby (Zhong)',  zh: '中' },
  { src: honorGreen, label: 'Jade (Fa)',     zh: '發' },
  { src: honorWhite, label: 'Pearl (Bai)',   zh: '白' },
]
const FLOWERS = [
  { red: flower1r, black: flower1b, num: 1 },
  { red: flower2r, black: flower2b, num: 2 },
  { red: flower3r, black: flower3b, num: 3 },
  { red: flower4r, black: flower4b, num: 4 },
]

function Tile({ src, label }) {
  return (
    <div className="cs-tile">
      <img src={src} alt={label} className="cs-tile-img" />
      {label !== undefined && (
        <span className="cs-tile-label">{label}</span>
      )}
    </div>
  )
}

function SuitRow({ label, labelZh, tiles, showNumbers }) {
  return (
    <div className="cs-suit-row">
      <div className="cs-suit-header">
        <span className="cs-suit-name">{label}</span>
        <span className="cs-suit-zh">({labelZh})</span>
      </div>
      <div className="cs-tile-row">
        {tiles.map((src, i) => (
          <div key={i} className="cs-tile">
            <img src={src} alt={`${label} ${i + 1}`} className="cs-tile-img" />
          </div>
        ))}
      </div>
      {showNumbers && (
        <div className="cs-number-row">
          {tiles.map((_, i) => (
            <div key={i} className="cs-number-cell">{i + 1}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function Cheatsheet() {
  return (
    <div className="cs-page">
      <div
        className="cs-pattern-wrap"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="cs-intro-box">
          <h1 className="cs-intro-title">Tile Cheat Sheet</h1>
          <p className="cs-intro-sub">Quick reference for all 144 tiles</p>
        </div>

        <div className="cs-inner">

          <section className="cs-section">
            <h2 className="cs-section-title">Suits</h2>
            <SuitRow label="Characters" labelZh="萬, wàn"  tiles={WAN}  showNumbers={false} />
            <SuitRow label="Bamboo"     labelZh="條, tiáo" tiles={TIAO} showNumbers={false} />
            <SuitRow label="Circles"    labelZh="筒, tǒng" tiles={TONG} showNumbers={true}  />
          </section>

          <div className="cs-bottom-grid">
            <section className="cs-section">
              <h2 className="cs-section-title">Dragons</h2>
              <div className="cs-tile-row">
                {DRAGONS.map((d, i) => (
                  <div key={i} className="cs-named-tile">
                    <img src={d.src} alt={d.label} className="cs-tile-img cs-tile-img--large" />
                    <span className="cs-tile-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="cs-section">
              <h2 className="cs-section-title">Winds</h2>
              <div className="cs-winds-grid">
                <div className="cs-winds-center">
                  <img src={windNorth} alt="North" className="cs-tile-img cs-tile-img--large" />
                  <span className="cs-wind-label">North</span>
                </div>
                <div className="cs-winds-middle">
                  <div className="cs-winds-side">
                    <img src={windEast} alt="East" className="cs-tile-img cs-tile-img--large" />
                    <span className="cs-wind-label">East</span>
                  </div>
                  <div className="cs-winds-side">
                    <img src={windWest} alt="West" className="cs-tile-img cs-tile-img--large" />
                    <span className="cs-wind-label">West</span>
                  </div>
                </div>
                <div className="cs-winds-center">
                  <img src={windSouth} alt="South" className="cs-tile-img cs-tile-img--large" />
                  <span className="cs-wind-label">South</span>
                </div>
              </div>
            </section>

            <section className="cs-section">
              <h2 className="cs-section-title">Flowers <span className="cs-optional">optional</span></h2>
              <div className="cs-flowers-grid">
                {FLOWERS.map((f) => (
                  <div key={f.num} className="cs-flower-pair">
                    <img src={f.red}   alt={`Flower ${f.num} red`}   className="cs-tile-img" />
                    <img src={f.black} alt={`Flower ${f.num} black`} className="cs-tile-img" />
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cheatsheet