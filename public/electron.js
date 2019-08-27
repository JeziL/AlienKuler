const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 960,
        height: 600,
        title: "Alien Kuler"
    })
    mainWindow.removeMenu()

    if (process.env.DEVMODE) {
        mainWindow.loadURL('http://localhost:3000/')
    } else {
        mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
    }

    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
