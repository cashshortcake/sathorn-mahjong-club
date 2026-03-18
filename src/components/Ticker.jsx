import './Ticker.css'
import star1 from '../assets/icons/ticker-star-1.svg'
import star2 from '../assets/icons/ticker-star-2.svg'

function Ticker() {
  const items = [
    { type: 'text', content: 'COUNTING TILES...' },
    { type: 'icon', src: star1 },
    { type: 'text', content: 'HOPEFULLY CORRECTLY' },
    { type: 'icon', src: star2 },
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {repeated.map((item, i) =>
          item.type === 'text' ? (
            <span key={i} className="ticker-item">{item.content}</span>
          ) : (
            <img key={i} src={item.src} alt="" className="ticker-icon" />
          )
        )}
      </div>
    </div>
  );
}

export default Ticker