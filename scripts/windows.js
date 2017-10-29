const electronInstaller = require('electron-winstaller');
const path = require('path');

const result = electronInstaller.createWindowsInstaller({
  appDirectory: path.resolve(__dirname, '../build/Fire Sale-win32-x64'),
  outputDirectory: path.resolve(__dirname, '../build/Fire Sale-win32-x64-installer'),
  authors: 'Steve Kinney',
  exe: 'Fire Sale.exe',
  icon: path.resolve(__dirname, '../icons/Icons.ico')
});

result.then(() => console.log('Success'))
      .catch((error) => console.error('Failed', error));