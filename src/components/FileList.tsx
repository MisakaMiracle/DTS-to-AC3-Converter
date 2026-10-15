import './FileList.css'

interface FileItem {
  id: string
  inputPath: string
  outputPath: string
  status: 'pending' | 'converting' | 'success' | 'error'
  progress: number
  error?: string
}

interface FileListProps {
  files: FileItem[]
  onAddFiles: () => void
  onRemoveFile: (id: string) => void
  onEditOutputPath: (id: string) => void
  disabled: boolean
}

function FileList({ files, onAddFiles, onRemoveFile, onEditOutputPath, disabled }: FileListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )
      case 'converting':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinning">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        )
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )
      default:
        return null
    }
  }

  const getFileName = (path: string) => {
    return path.split('\\').pop() || path.split('/').pop() || path
  }

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <h2 className="file-list-title">文件列表</h2>
        <button className="add-files-button" onClick={onAddFiles} disabled={disabled}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加文件
        </button>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <p className="empty-text">还没有添加任何文件</p>
          <p className="empty-hint">点击上方"添加文件"按钮选择视频文件</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.id} className={`file-item file-item-${file.status}`}>
              <div className="file-item-header">
                <div className="file-status-icon">
                  {getStatusIcon(file.status)}
                </div>
                <div className="file-info">
                  <div className="file-name">{getFileName(file.inputPath)}</div>
                  <div className="file-path">{file.inputPath}</div>
                </div>
                {!disabled && file.status === 'pending' && (
                  <button
                    className="file-remove-button"
                    onClick={() => onRemoveFile(file.id)}
                    title="移除"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {file.status === 'converting' && (
                <div className="file-progress-bar">
                  <div className="file-progress-fill" style={{ width: `${file.progress}%` }}></div>
                </div>
              )}

              <div className="file-output">
                <span className="file-output-label">输出:</span>
                <span className="file-output-path">{getFileName(file.outputPath)}</span>
                {!disabled && file.status === 'pending' && (
                  <button
                    className="file-edit-button"
                    onClick={() => onEditOutputPath(file.id)}
                    title="更改输出路径"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>

              {file.error && (
                <div className="file-error">{file.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileList
