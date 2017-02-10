const { app, BrowserWindow, dialog, Menu } = require('electron');
const generateApplicationMenu = require('./application-menu');
const fs = require('fs');

const windows = new Set();
const openFiles = new Map();

app.on('ready', () => {
  Menu.setApplicationMenu(generateApplicationMenu(windows));
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
});

app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) { createWindow(); }
});

const createWindow = exports.createWindow = () => {
  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({ x, y, show: false });

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('close', (event) => {
    if (newWindow.isDocumentEdited()) {
      event.preventDefault();

      const result = dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Your changes will be lost permanently if you do not save.',
        buttons: [
          'Quit Anyway',
          'Cancel',
        ],
        cancelId: 1,
        defaultId: 0
      });

      if (result === 0) newWindow.destroy();
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    stopWatchingFile(newWindow);
    Menu.setApplicationMenu(generateApplicationMenu(windows));
    newWindow = null;
  });

  windows.add(newWindow);
  Menu.setApplicationMenu(generateApplicationMenu(windows));
  return newWindow;
};

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  });

  if (files) { openFile(targetWindow, files[0]); }
};

const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
  startWatchingFile(targetWindow, file);
};


const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(targetWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'markdown'] }
      ]
    });
  }

  if (!file) return;

  fs.writeFileSync(file, content);
  openFile(targetWindow, file);
};

const saveHtml = exports.saveHtml = (targetWindow, content) => {
  const file = dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html', 'htm'] }
    ]
  });

  if (!file) return;

  fs.writeFileSync(file, content);
};

const startWatchingFile = (targetWindow, file) => {
  stopWatchingFile(targetWindow);

  const watcher = fs.watchFile(file, () => {
    const content = fs.readFileSync(file);
    targetWindow.webContents.send('file-changed', file, content);
  });

  openFiles.set(targetWindow, watcher);
};

const stopWatchingFile = (targetWindow) => {
  if (openFiles.has(targetWindow)) {
    openFiles.get(targetWindow).stop();
    openFiles.delete(targetWindow);
  }
};
