import { useState, useEffect } from 'react'
import TitleBar from './components/TitleBar'
import FileList from './components/FileList'
import ConversionPanel from './components/ConversionPanel'
import './App.css'

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      selectInputFiles: () => Promise<string[]>
      selectOutputFile: (defaultPath: string) => Promise<string | null>
      convertAudio: (inputPath: string, outputPath: string, bitrate: string) => Promise<{ success: boolean }>
      onConversionProgress: (callback: (progress: number) => void) => void
    }
  }
}

interface FileItem {
  id: string
  inputPath: string
  outputPath: string
  status: 'pending' | 'converting' | 'success' | 'error'
  progress: number
  error?: string
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [bitrate, setBitrate] = useState<string>('640k')
  const [isConverting, setIsConverting] = useState(false)
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)

  useEffect(() => {
    window.electronAPI.onConversionProgress((prog) => {
      if (currentFileId) {
        setFiles(prev => prev.map(f =>
          f.id === currentFileId ? { ...f, progress: prog } : f
        ))
      }
    })
  }, [currentFileId])

  const generateOutputPath = (inputPath: string): string => {
    // 手动解析路径（渲染进程无 Node.js path 模块）
    const lastSep = Math.max(inputPath.lastIndexOf('\\'), inputPath.lastIndexOf('/'))
    const dir = lastSep >= 0 ? inputPath.substring(0, lastSep) : ''
    const filename = lastSep >= 0 ? inputPath.substring(lastSep + 1) : inputPath

    const dotIndex = filename.lastIndexOf('.')
    const hasExt = dotIndex > 0
    const ext = hasExt ? filename.substring(dotIndex) : ''
    const base = hasExt ? filename.substring(0, dotIndex) : filename

    const cleanName = base.replace(/[_\-\s]*DTS[_\-\s]*/gi, '')
    return `${dir}\\${cleanName}_AC3${ext}`
  }

  const handleAddFiles = async () => {
    const selectedFiles = await window.electronAPI.selectInputFiles()
    if (selectedFiles.length > 0) {
      const newFiles: FileItem[] = selectedFiles.map(filePath => ({
        id: `${Date.now()}-${Math.random()}`,
        inputPath: filePath,
        outputPath: generateOutputPath(filePath),
        status: 'pending',
        progress: 0
      }))
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleEditOutputPath = async (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file) return

    const newPath = await window.electronAPI.selectOutputFile(file.outputPath)
    if (newPath) {
      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, outputPath: newPath } : f
      ))
    }
  }

  const handleConvertAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error')
    if (pendingFiles.length === 0) return

    setIsConverting(true)

    for (const file of pendingFiles) {
      setCurrentFileId(file.id)
      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, status: 'converting', progress: 0, error: undefined } : f
      ))

      try {
        await window.electronAPI.convertAudio(file.inputPath, file.outputPath, bitrate)
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
        ))
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? {
            ...f,
            status: 'error',
            error: error instanceof Error ? error.message : '转换失败'
          } : f
        ))
      }
    }

    setCurrentFileId(null)
    setIsConverting(false)
  }

  const handleReset = () => {
    setFiles([])
    setCurrentFileId(null)
  }

  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    converting: files.filter(f => f.status === 'converting').length,
    success: files.filter(f => f.status === 'success').length,
    error: files.filter(f => f.status === 'error').length
  }

  return (
    <div className="app">
      <TitleBar />

      <div className="content">
        <div className="header">
          <h1 className="title">DTS 转 AC3 音频转换工具</h1>
          <p className="subtitle">批量将 DTS 音轨转换为 AC3 格式，兼容更多设备</p>
        </div>

        <FileList
          files={files}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onEditOutputPath={handleEditOutputPath}
          disabled={isConverting}
        />

        <ConversionPanel
          bitrate={bitrate}
          onBitrateChange={setBitrate}
          isConverting={isConverting}
          stats={stats}
          onConvert={handleConvertAll}
          onReset={handleReset}
          hasFiles={files.length > 0}
        />
      </div>
    </div>
  )
}

export default App
