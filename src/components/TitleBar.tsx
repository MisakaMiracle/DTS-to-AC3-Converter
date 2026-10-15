import './TitleBar.css'

function TitleBar() {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow()
  }

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow()
  }

  const handleClose = () => {
    window.electronAPI.closeWindow()
  }

  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <div className="titlebar-title">DTS 转 AC3 工具</div>
      </div>
      <div className="titlebar-controls">
        <button className="titlebar-button minimize" onClick={handleMinimize}>
          <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
            <rect width="12" height="2" fill="currentColor"/>
          </svg>
        </button>
        <button className="titlebar-button maximize" onClick={handleMaximize}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
        <button className="titlebar-button close" onClick={handleClose}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TitleBar
