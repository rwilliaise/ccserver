import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

  const serverWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  serverWindow.loadURL(path.join('file://', __dirname, '/server.html'))

  ipcMain.on('server-update', (event, args) => {
    mainWindow.webContents.send('server-update', args)
  })

  ipcMain.on('main-update', (event, args) => {
    serverWindow.webContents.send('main-update', args)
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
