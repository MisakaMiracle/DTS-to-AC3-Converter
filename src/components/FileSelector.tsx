import './FileSelector.css'

interface FileSelectorProps {
  inputFile: string
  outputFile: string
  onInputSelect: () => void
  onOutputSelect: () => void
  disabled: boolean
}

function FileSelector({ inputFile, outputFile, onInputSelect, onOutputSelect, disabled }: FileSelectorProps) {
  return (
    <div className="file-selector">
      <div className="file-group">
        <label className="file-label">输入文件 (DTS音轨)</label>
        <div className="file-input-wrapper">
          <input
            type="text"
            className="file-input"
            value={inputFile}
            placeholder="选择包含 DTS 音轨的视频文件..."
            readOnly
            disabled={disabled}
          />
          <button
            className="file-button"
            onClick={onInputSelect}
            disabled={disabled}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            选择文件
          </button>
        </div>
      </div>

      <div className="file-group">
        <label className="file-label">输出文件 (AC3音轨)</label>
        <div className="file-input-wrapper">
          <input
            type="text"
            className="file-input"
            value={outputFile}
            placeholder="转换后的文件保存位置..."
            readOnly
            disabled={disabled}
          />
          <button
            className="file-button"
            onClick={onOutputSelect}
            disabled={disabled || !inputFile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            保存位置
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileSelector
