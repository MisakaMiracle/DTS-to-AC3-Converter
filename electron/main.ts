import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    backgroundColor: '#0A0D12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 窗口控制
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.on('window-close', () => {
  mainWindow?.close()
})

// 文件选择对话框 - 支持多选
ipcMain.handle('select-input-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'mkv', 'avi', 'mov', 'm4v'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths
  }
  return []
})

ipcMain.handle('select-output-file', async (_, defaultPath: string) => {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'mkv'] }
    ]
  })

  if (!result.canceled && result.filePath) {
    return result.filePath
  }
  return null
})

// FFmpeg 转换
ipcMain.handle('convert-audio', async (_, inputPath: string, outputPath: string, bitrate: string) => {
  return new Promise((resolve, reject) => {
    // FFmpeg 路径
    const ffmpegPath = app.isPackaged
      ? path.join(process.resourcesPath, 'ffmpeg', 'ffmpeg.exe')
      : path.join(process.cwd(), 'ffmpeg', 'ffmpeg.exe')

    // 检查 FFmpeg 是否存在
    if (!fs.existsSync(ffmpegPath)) {
      reject(new Error('FFmpeg not found. Please ensure ffmpeg.exe is in the ffmpeg folder.'))
      return
    }

    // FFmpeg 命令参数
    const args = [
      '-i', inputPath,
      '-map', '0:v',  // 保留视频流
      '-c:v', 'copy',  // 视频不重新编码
      '-map', '0:a',   // 音频流
      '-c:a', 'ac3',   // 转换为 AC3
      '-b:a', bitrate, // 音频比特率
      '-map', '0:s?',  // 可选的字幕流
      '-c:s', 'copy',  // 字幕不重新编码
      '-y',            // 覆盖输出文件
      outputPath
    ]

    const ffmpeg = spawn(ffmpegPath, args)

    let stderr = ''

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString()

      // 解析进度信息
      const timeMatch = stderr.match(/time=(\d{2}):(\d{2}):(\d{2})/)
      const durationMatch = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2})/)

      if (timeMatch && durationMatch) {
        const currentSeconds = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3])
        const totalSeconds = parseInt(durationMatch[1]) * 3600 + parseInt(durationMatch[2]) * 60 + parseInt(durationMatch[3])
        const progress = Math.min(100, Math.round((currentSeconds / totalSeconds) * 100))

        mainWindow?.webContents.send('conversion-progress', progress)
      }
    })

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        reject(new Error(`FFmpeg exited with code ${code}\n${stderr}`))
      }
    })

    ffmpeg.on('error', (error) => {
      reject(error)
    })
  })
})