# FFmpeg 目录

此目录用于存放 FFmpeg 可执行文件。

## 获取 FFmpeg

### 自动下载（推荐）

运行以下命令自动下载 FFmpeg：

```bash
npm run download-ffmpeg
```

### 手动下载

1. 访问 [FFmpeg 官方构建版本](https://github.com/BtbN/FFmpeg-Builds/releases)
2. 下载 `ffmpeg-master-latest-win64-gpl.zip`
3. 解压后，将 `bin/ffmpeg.exe` 复制到此目录

## 目录结构

```
ffmpeg/
├── .gitkeep          # 保持目录结构
├── README.md         # 本文件
└── ffmpeg.exe        # FFmpeg 可执行文件（自行下载）
```

## 注意事项

- `ffmpeg.exe` 文件约 160MB，已添加到 `.gitignore`
- 构建时会自动将此文件打包到最终的 exe 中
- 开发时必须先下载 FFmpeg 才能运行程序
