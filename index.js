'use strict';

var SerialPort = require('serialport');
var ArgumentRequiredError = require('./lib/ArgumentRequiredError');

function getApiVersion(version) {
  switch (version) {
  case 'v0.1':
    return require('./lib/ApiV0_1');
  case 'v0.104':
    return require('./lib/ApiV0_104');
  case 'v0.105':
  default:
    return require('./lib/ApiV0_105');
  }
}

module.exports = {
  createPort: function (path) {
    return new SerialPort(path, {
      baudRate: 57600,
      databits: 8
      // parity: 'none', // none is default
      // stopbits: 1, // 1 is default
    });
  },
  api: function (port, version) {
    if (!port) {
      throw new ArgumentRequiredError('port');
    }
    var API = getApiVersion(version);
    return new API(port);
  }
};
