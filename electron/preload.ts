import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // 文件操作 - 支持多选
  selectInputFiles: () => ipcRenderer.invoke('select-input-files'),
  selectOutputFile: (defaultPath: string) => ipcRenderer.invoke('select-output-file', defaultPath),

  // 转换功能
  convertAudio: (inputPath: string, outputPath: string, bitrate: string) =>
    ipcRenderer.invoke('convert-audio', inputPath, outputPath, bitrate),

  // 进度监听
  onConversionProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('conversion-progress', (_, progress) => callback(progress))
  }
})
