import BorderBox from '../components/BorderBox'
import './Score.css'

function Score() {
  return (
    <div className="score-page">
      <h1 className="score-title">Score Assistant</h1>
      <BorderBox>
        <div className="score-coming">
          <div className="score-emoji">🀄</div>
          <h2 className="score-subtitle">Coming Soon</h2>
          <p className="score-body">
            A guided scoring tool for the table — step by step fan calculation,
            payment breakdown, and running score tracker.
          </p>
          <p className="score-note">Currently in design.</p>
        </div>
      </BorderBox>
    </div>
  )
}

export default Score