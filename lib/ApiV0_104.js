/* global Promise */
'use strict';

var ApiBase = require("./ApiV0_1")

/**
 * eMotimo ST4 API v0.104
 * Addition of G700, G710
 *
 * @constructor
 * @param {SerialPort} port - The port.
 */
function ApiV0_104(port) {
  ApiBase.call(this, port);
}
ApiV0_104.prototype = Object.create(ApiBase.prototype);
ApiV0_104.prototype.constructor = ApiV0_104;

/**
 * Get api version
 *
 * @type {number}
 */
ApiV0_104.prototype.version = 0.104;

/**
 * SYSTEM GROUP - S
 */

/**
 * G700 – Returns current firmware Version
 * Example:
 * G700
 * Version: ST4_RC007_36
 */
ApiV0_104.prototype.g700 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (resp) {
      var result = {
        model: String(resp).split(' ')[1].split('_')[0],
        version: (String(resp).split(' ')[1].split('_')[1] + "." + String(resp).split(' ')[1].split('_')[2]),
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write('G700\n');
  });
}

/**
 * G710 – Turn off Pre/Post amble
 * By default the spectrum doesn’t add any tags to delimit the start and end of a response. Most terminal programs will parse this just fine, but if you need to systematically and buffer multiple commands and response, delimiters are helpful.
 * This command either sets an internal flag (volatile) in the spectrum and then returns the version. If the pre/post amble is set, then the spectrum prepends all returns with “<STX>” and appends all returns with “<ETX>”.
 * Note - “<STX>” and “<ETX>” are control characters, not 5 byte strings.
 * "\x02", //hex 02, dec 2, <STX> "\x03" //hex 03, dec 3, <ETX>
 * Parameters
 * 1. S -Set – 1 adds pre/postamble to all returns of <STX> and <ETX>. All other values including omission, returns the spectrum to the default state of no prepends/appends.
 * Example:
 * G700
 * Version: ST4_RC007_36
 * G710
 * Version: ST4_RC007_36
 * G710 S1
 * <STX>Version: ST4_RC007_36<ETX>
 * G710 S0
 * Version: ST4_RC007_36
 */
ApiV0_104.prototype.g710 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G710 ' + _this.stringifyParams(params, ['s']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(',');
      var result = {
        model: String(resp).split(' ')[1].split('_')[0],
        version: (String(resp).split(' ')[1].split('_')[1] + "." + String(resp).split(' ')[1].split('_')[2]),
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write(command);
  });
}

module.exports = ApiV0_104;
