const { crashReporter } = require('electron');
const request = require('request');
const manifest = require('../package.json');

const host = 'http://localhost:3000/';

const config = {
  productName: 'Fire Sale',
  companyName: 'Electron in Action',
  submitURL: host + 'crashreports',
  uploadToServer: true,
};

crashReporter.start(config);

const sendUncaughtException = error => {
  const { productName, companyName } = config;
  console.info('Catching error', error);
  request.post(host + 'uncaughtexceptions', {
    form: {
      _productName: productName,
      _companyName: companyName,
      _version: manifest.version,
      platform: process.platform,
      process_type: process.type,
      ver: process.versions.electron,
      error: {
        name: error.name,
        message: error.message,
        fileName: error.fileName,
        stack: error.stack,
        lineNumber: error.lineNumber,
        columnNumber: error.columnNumber,
      },
    },
  });
};

if (process.type === 'browser') {
  process.on('uncaughtException', sendUncaughtException);
} else {
  window.addEventListener('error', sendUncaughtException);
}

console.log('[INFO] Crash reporting started.', crashReporter);

module.exports = crashReporter;
