import './Ticker.css'
import eastIcon  from '../assets/icons/wind-east-player.svg'
import southIcon from '../assets/icons/wind-south-player.svg'

function Ticker() {
  const items = [
    { type: 'text', content: 'COUNTING TILES...' },
    { type: 'icon', src: eastIcon  },
    { type: 'text', content: 'HOPEFULLY CORRECTLY' },
    { type: 'icon', src: southIcon },
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
