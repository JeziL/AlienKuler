const { app, BrowserWindow } = require('electron')
const path = require('path')
const { ipcMain } = require('electron');
const { LightFX } = require('./AlienFX/LightFX');
const { RESULT, Color } = require('./AlienFX/constants');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        title: "Alien Kuler",
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'electron-wrapper.js')
        }
    })
    mainWindow.setMenu(null);

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

ipcMain.on('LFX_SETLIGHT', (event, arg) => {
    const libLightFX = new LightFX(path.join(__dirname, 'LightFX.dll'));
    const alignment = (arg.align === 'left') ? 0 : 1;
    const result = libLightFX.initialize();
    if (result === RESULT.SUCCESS) {
        (async () => {
            for (let i = 0; i < 4; i++) {
                const swatch = arg.theme.swatches[i + alignment];
                const color = new Color({
                    red: Math.ceil(swatch.values[0] * 255),
                    green: Math.ceil(swatch.values[1] * 255),
                    blue: Math.ceil(swatch.values[2] * 255),
                    brightness: 255
                });
                console.log(color);
                let result = libLightFX.setLightColor(0, i, color);
                if (result !== RESULT.SUCCESS) {
                    event.sender.send('LFX_SETLIGHT_RESULT', result);
                    return;
                }
                result = await libLightFX.update();
                if (result !== RESULT.SUCCESS) {
                    event.sender.send('LFX_SETLIGHT_RESULT', result);
                    return;
                }
            }
            event.sender.send('LFX_SETLIGHT_RESULT', RESULT.SUCCESS);
        })();
    } else {
        event.sender.send('LFX_SETLIGHT_RESULT', result);
    }
});
