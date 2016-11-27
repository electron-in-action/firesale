const { app, BrowserWindow, dialog } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    getFileFromUserSelection();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

const getFileFromUserSelection = () => {
  const files = dialog.showOpenDialog({
    properties: ['openFile']
  });

  if (!files) { return; }

  console.log(files);
};
