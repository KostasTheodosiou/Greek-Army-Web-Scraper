const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1700,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Ensure this is false if you want to use require in the renderer
    }
  });

  // Load the main HTTPS URL
  mainWindow.loadURL('http://localhost:5000');

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Start the Express server
  serverProcess = spawn('node', ['backend/index.js'], { stdio: ['pipe', 'pipe', 'pipe'] });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
    if (mainWindow) {
      mainWindow.webContents.send('server-stdout', data.toString());
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
    if (mainWindow) {
      mainWindow.webContents.send('server-stderr', data.toString());
    }
  });

  serverProcess.on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
  });

  serverProcess.on('exit', (code, signal) => {
    console.log(`Server process exited with code ${code} and signal ${signal}`);
  });

  // Create tray icon and menu
  tray = new Tray(path.join(__dirname, './tray-icon.png')); // Replace with your tray icon path
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);

  tray.on('click', function () {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });

  createWindow();
});

app.on('window-all-closed', function () {
  // Do not quit the app when all windows are closed
});

app.on('before-quit', function () {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});

app.on('quit', function () {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
