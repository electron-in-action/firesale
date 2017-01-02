const { app, BrowserWindow, Menu, shell } = require('electron');
const mainProcess = require('./main');

const template = [ //B
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'paste',
      },
    ]
  }
];
