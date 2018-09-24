/* global describe, it, expect */
'use strict';

var SerialPort = require('serialport');

/**
 * Specification for emotimo-st4
 */
describe('emotimo-st4', function () {
  it('should be require-able', function () {
    var emotimo = require('../index');
    expect(emotimo).to.be.ok;
  });

  describe('createPort()', function () {
    it('should exist', function () {
      var emotimo = require('../index');

      expect(emotimo.createPort).to.be.ok;
    });

    it('should create SerialPort', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(port).to.be.ok;
    });

    it('should return instance of SerialPort class', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(port instanceof SerialPort).to.be.true;
    });

    it('should set path of SerialPort to users input', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(port.path).to.be.equal('/dev/tty.SLAB_USBtoUART');
    });

    it('should set Baudrate of SerialPort to 57600 bits per second', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(JSON.stringify(port.options.baudRate)).to.be.equal('57600');
    });

    it('should set Data Bits of SerialPort to 8', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(JSON.stringify(port.options.dataBits)).to.be.equal('8');
    });

    it('should set Parity of SerialPort to None', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(JSON.stringify(port.options.parity)).to.be.equal('"none"');
    });

    it('should set Stop Bits of SerialPort to 1', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      expect(JSON.stringify(port.options.stopBits)).to.be.equal('1');
    });

    it('should set Flow Control of SerialPort to None', function () {
      var emotimo = require('../index');
      var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');

      // XON/XOFF
      expect(JSON.stringify(port.options.xon)).to.be.equal('false');
      expect(JSON.stringify(port.options.xoff)).to.be.equal('false');

      // RTS/CTS
      expect(JSON.stringify(port.options.rtscts)).to.be.equal('false');
    });
  });

  describe('api()', function () {
    it('should exist', function () {
      var emotimo = require('../index');
      var api = emotimo.api(emotimo.createPort('/dev/tty.SLAB_USBtoUART'));

      expect(api).to.be.ok;
    });

    it('should required port variable', function () {
      var emotimo = require('../index');
      var ArgumentRequiredError = require('../lib/ArgumentRequiredError');

      expect(emotimo.api).to.throw(ArgumentRequiredError, '\'port\' argument is required');
    });

    it('should return legacy api when requested', function () {
      var emotimo = require('../index');
      var Api = require('../lib/ApiV0_1');
      var api = emotimo.api(emotimo.createPort('/dev/tty.SLAB_USBtoUART'), 'v0.1');

      expect(api instanceof Api).to.be.true;
    });

    it('should return v0.104 api when requested', function () {
      var emotimo = require('../index');
      var Api = require('../lib/ApiV0_104');
      var api = emotimo.api(emotimo.createPort('/dev/tty.SLAB_USBtoUART'), 'v0.104');

      expect(api instanceof Api).to.be.true;
    });

    it('should return v0.105 api when requested', function () {
      var emotimo = require('../index');
      var Api = require('../lib/ApiV0_105');
      var api = emotimo.api(emotimo.createPort('/dev/tty.SLAB_USBtoUART'), 'v0.105');

      expect(api instanceof Api).to.be.true;
    });

    it('should return latest api version when no version is specified', function () {
      var emotimo = require('../index');
      var Api = require('../lib/ApiV0_105');
      var api = emotimo.api(emotimo.createPort('/dev/tty.SLAB_USBtoUART'));

      expect(api instanceof Api).to.be.true;
    });
  });
});
