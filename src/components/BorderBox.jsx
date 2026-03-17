import './BorderBox.css'

function BorderBox({ children }) {
    return (
      <div className="border-box-outer">
        <div className="border-box-inner">
          {children}
        </div>
      </div>
    )
  }
  
  export default BorderBox