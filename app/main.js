const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

app.on('ready', () => {
  createWindow();
});

const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({ show: false });
  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  return newWindow;
};

const getFileFromUser  = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  });

  if (files) { openFile(targetWindow, files[0]); }
};

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send('file-opened', file, content);
};

