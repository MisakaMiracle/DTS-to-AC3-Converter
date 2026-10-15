import './ConversionPanel.css'

interface ConversionPanelProps {
  bitrate: string
  onBitrateChange: (bitrate: string) => void
  isConverting: boolean
  stats: {
    total: number
    pending: number
    converting: number
    success: number
    error: number
  }
  onConvert: () => void
  onReset: () => void
  hasFiles: boolean
}

function ConversionPanel({
  bitrate,
  onBitrateChange,
  isConverting,
  stats,
  onConvert,
  onReset,
  hasFiles
}: ConversionPanelProps) {
  const canConvert = hasFiles && (stats.pending > 0 || stats.error > 0) && !isConverting
  const showStats = hasFiles && stats.total > 0

  return (
    <div className="conversion-panel">
      <div className="settings-section">
        <label className="setting-label">音频比特率</label>
        <div className="bitrate-options">
          {['448k', '640k', '768k'].map((rate) => (
            <button
              key={rate}
              className={`bitrate-button ${bitrate === rate ? 'active' : ''}`}
              onClick={() => onBitrateChange(rate)}
              disabled={isConverting}
            >
              {rate}
            </button>
          ))}
        </div>
        <p className="setting-hint">推荐使用 640k 以获得最佳音质</p>
      </div>

      {showStats && (
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-label">总计</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-item stat-pending">
            <div className="stat-label">等待</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          {stats.converting > 0 && (
            <div className="stat-item stat-converting">
              <div className="stat-label">转换中</div>
              <div className="stat-value">{stats.converting}</div>
            </div>
          )}
          <div className="stat-item stat-success">
            <div className="stat-label">成功</div>
            <div className="stat-value">{stats.success}</div>
          </div>
          {stats.error > 0 && (
            <div className="stat-item stat-error">
              <div className="stat-label">失败</div>
              <div className="stat-value">{stats.error}</div>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        {!isConverting && stats.success < stats.total ? (
          <button
            className="convert-button"
            onClick={onConvert}
            disabled={!canConvert}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {stats.error > 0 ? '重试失败项' : '开始批量转换'}
          </button>
        ) : (
          <button className="reset-button" onClick={onReset} disabled={isConverting}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
            </svg>
            清空列表
          </button>
        )}
      </div>
    </div>
  )
}

export default ConversionPanel
