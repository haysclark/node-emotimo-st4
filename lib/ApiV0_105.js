/* global Promise */
'use strict';

var ApiV0_104 = require("./ApiV0_104")

/**
 * eMotimo ST4 API v0.105
 * Addition of G215 and G216
 *
 * @constructor
 * @param {SerialPort} port - The port.
 */
function ApiV0_105(port) {
  ApiV0_104.call(this, port);
}
ApiV0_105.prototype = Object.create(ApiV0_104.prototype);
ApiV0_105.prototype.constructor = ApiV0_105;

/**
 * Get api version
 *
 * @type {number}
 */
ApiV0_105.prototype.version = 0.105;

/**
 * G215 – Query Motor Virtual STOPA
 * This returns the current STOPA value for the motor. If the stop is not set, the value of the return is the full numerical limit. Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * Example: Move to a known position (stops not adhered to) and set virtual stop for M3 Virtual Stop A to that position. Query Stop A, clear the STOPA and then query STOPA again.
 * G1 X10000 Y20000 Z-15000 W2000 T1.5 A0.25
 * Move to:X10000,Y20000,Z-15000,W2000
 * G213 M3
 * M3 Virtual StopA set to:-15000
 * G215 M3
 * M3 Virtual StopA set to:-15000
 * G211 M3
 * M3 Virtual StopA set to:-2100000000
 * G215 M3
 * M3 Virtual StopA set to:-2100000000
 */
ApiV0_105.prototype.g215 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G215 ' + _this.stringifyParams(params, ['m']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(',');
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write(command);
  });
}

/**
 * G216 – Query Motor Virtual STOPB
 * This returns the current STOPA value for the motor. If the stop is not set, the value of the return is the full numerical limit. Parameters
 * 1. Motor:1forPan,2forTilt,3forM3,4forM4
 * Example: Move to a known position (stops not adhered to) and set virtual stop for M3 Virtual Stop B to that position. Query Stop B, clear the STOPB and then query STOPB again.
 * G1 X10000 Y20000 Z45000 W2000 T1.5 A0.25
 * Move to:X10000,Y20000,Z45000,W2000
 * G214 M3
 * M3 Virtual StopB set to:45000
 * G216 M3
 * M3 Virtual StopB set to:45000
 * G212 M3
 * M3 Virtual StopB set to:2100000000
 * G216 M3
 * M3 Virtual StopB set to:2100000000
 */
ApiV0_105.prototype.g216 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G216 ' + _this.stringifyParams(params, ['m']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(',');
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write(command);
  });
}

module.exports = ApiV0_105;
