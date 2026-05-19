# AI 會議記錄助理 (AI Meeting Assistant)

這是一個基於 React、Vite、Express 和 Gemini API 建立的會議記錄與翻譯助理。

## 開發環境運行 (Run Locally)

### 準備工作 (Prerequisites)
- Node.js (建議 v18 以上)

1. **安裝依賴套件**：
   ```bash
   npm install
   ```

2. **設定環境變數**：
   在專案根目錄下建立 `.env` 檔案，並填入您的 Gemini API Key：
   ```env
   GEMINI_API_KEY="您的_GEMINI_API_KEY"
   ```

3. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```
   瀏覽器打開 `http://localhost:3000` 即可進行開發與測試。

---

## 專案發布與生產環境部署 (Production Deployment)

此專案已完成生產環境優化，支援多種直接發布與部署方式。

### 1. 本地打包與運行 (Build & Run Locally)

您可以在本地端先行打包測試生產環境版本：

```bash
# 1. 進行專案打包 (會將前端與後端分別打包至 dist 目錄)
npm run build

# 2. 以生產環境模式啟動伺服器 (Windows PowerShell)
$env:NODE_ENV="production"; $env:PORT="3000"; npm run start

# (Linux / macOS 啟動方式)
# NODE_ENV=production PORT=3000 npm run start
```
---

### 2. 部署至雲端平台 (Cloud Platforms)

本專案支援一鍵部署至大部分的主流 PaaS 平台（如 Render, Railway, Fly.io, Zeabur 等）：

#### Render / Railway 部署設定：
- **Build Command (建置指令)**: `npm run build`
- **Start Command (啟動指令)**: `npm run start`
- **Environment Variables (環境變數)**:
  - `NODE_ENV`: `production`
  - `PORT`: `3000` (平台通常會自動處理 PORT，專案內建支援讀取系統 PORT)
  - `GEMINI_API_KEY`: `您的_GEMINI_API_KEY` (請至該平台的 Secrets/Variables 設定)
