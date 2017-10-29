const electronInstaller = require('electron-winstaller');
const path = require('path');

const iconPath = path.resolve(__dirname, '../icons/Icon.ico');

const result = electronInstaller.createWindowsInstaller({
  appDirectory: path.resolve(__dirname, '../build/Fire Sale-win32-x64'),
  authors: 'Steve Kinney',
  exe: 'Fire Sale.exe',
  icon: iconPath,
  name: 'Fire Sale',
  outputDirectory: path.resolve(
    __dirname,
    '../build/Fire Sale-win32-x64-installer',
  ),
  setupExe: 'FireSaleSetup.exe',
  setupIcon: iconPath,
  setupMsi: 'FireSaleSetup.msi',
  title: 'Fire Sale',
});

result
  .then(() => console.log('Success'))
  .catch(error => console.error('Failed', error));
