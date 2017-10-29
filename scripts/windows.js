const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');

const iconPath = path.resolve(__dirname, '../icons/Icon.ico');

const result = createWindowsInstaller({
  title: 'Fire Sale',
  authors: 'Steve Kinney',
  appDirectory: path.resolve(__dirname, '../build/Fire Sale-win32-x64'),
  outputDirectory: path.resolve(
    __dirname,
    '../build/Fire Sale-win32-x64-installer'
  ),
  icon: iconPath,
  setupIcon: iconPath,
  setupExe: 'FireSaleSetup.exe',
  setupMsi: 'FireSaleSetup.msi',
});

result
  .then(() => console.log('Success'))
  .catch(error => console.error('Failed', error));
