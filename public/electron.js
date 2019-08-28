const { app, BrowserWindow } = require('electron')
const path = require('path')
const { ipcMain } = require('electron');
const fs = require('fs');
const { LightFX } = require('./AlienFX/LightFX');
const { RESULT, Color } = require('./AlienFX/constants');

let mainWindow
let favorites

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
    BrowserWindow.addDevToolsExtension("C:\\Users\\Li\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.0.6_0")
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
  }

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
    favorites = null
  })
}

app.on('ready', () => {
  loadFavorites();
  createWindow();
})

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

loadFavorites = () => {
  const favFile = path.join(app.getPath('userData'), 'favorites.json');
  if (fs.existsSync(favFile)) {
    favorites = JSON.parse(fs.readFileSync(favFile, { encoding: 'utf8' }));
  } else {
    favorites = {};
    fs.writeFile(favFile, JSON.stringify(favorites), err => {
      if (err) throw err;
    });
  }
};

ipcMain.on('APP_HEART', (event, arg) => {
  if (arg.action === 'heart') {
    favorites[arg.theme.id] = arg.theme;
  } else {
    delete favorites[arg.theme.id];
  }

  const favFile = path.join(app.getPath('userData'), 'favorites.json');
  try {
    fs.writeFileSync(favFile, JSON.stringify(favorites));
  } catch (error) {
    event.returnValue = -1;
  }
  event.returnValue = 0;
});

ipcMain.on('APP_FAVFLAGS', (event, arg) => {
  let flags = [];
  arg.map(theme => theme.id).map(id => {
    flags.push((id in favorites));
  });
  event.returnValue = flags;
});

ipcMain.on('APP_GETFAVS', (event, arg) => {
  const favThemes = Object.values(favorites);
  const start = Math.min((arg.page - 1) * arg.limit, favThemes.length - 1);
  const end = Math.min(start + arg.limit, favThemes.length);

  event.returnValue = {
    themes: favThemes.slice(start, end),
    total: favThemes.length
  }
});
