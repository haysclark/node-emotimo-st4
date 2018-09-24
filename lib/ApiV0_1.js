/* global Promise */
'use strict';

/**
 * eMotimo ST4 API v0.1
 *
 * @constructor
 * @param {SerialPort} port - The port.
 */
function ApiV0_1(port) {
  this.port = port;
}

/**
 * Get api version
 *
 * @type {number}
 */
ApiV0_1.prototype.version = 0.1;

/**
 * Get api description.
 *
 * @return {String}
 */
ApiV0_1.prototype.toString = function() {
  return 'eMotimo ST4 API v' + this.version;
};

ApiV0_1.prototype.stringifyParams = function(params, includes) {
  var values = [];
  for (var i = 0; i < includes.length; i++) {
    if (params && params.hasOwnProperty(includes[i]))
    {
      values.push(includes[i].toUpperCase() + params[includes[i]]);
    }
  }
  return values.join(' ');
}

ApiV0_1.prototype.waitForStop = function(payload) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    //var done = false;
    process.stdout.write('waiting for move');
    _this.port.on('data', function (data) {
      var movingSet = String(data).split(' ')[0];
      if (parseInt(movingSet) > 0) {
        process.stdout.write('.');
        _this.port.write('G500\n');
      } else {
        //if (done) return;
        //done = true;
        process.stdout.write('!\n');
        resolve(payload);
      }
    });
    _this.port.write('G500\n');
  });
}

/**
 * G0 – Go Rapid
 * goes to a particular position defined by absolute coordinates of all axis.
 * Each motor move independently to position using the currently set max
 * velocities and acceleration for each axis. Use this when coordinated moves are
 * not needed.
 * Example: Go to absolute pan position 10000, tilt position 20000, M3 position -15000, M4 position 2000
 * G0 X10000 Y20000 Z-15000 W2000
 * Rapid to:,X10000,Y20000,Z-15000,W2000
 * Notes –
 * • Virtual Stops are not adhered to when using G0 and G1.
 * • If no value is given for an axis, no move command is given to that axis.
 */
ApiV0_1.prototype.g0 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G0 ' + _this.stringifyParams(params, ['x', 'y', 'z', 'w']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(':')[1].split(',').splice(1);
      var result = {
        x: String(array[0]).substr(1),
        y: String(array[1]).substr(1),
        z: String(array[2]).substr(1),
        w: String(array[3]).substr(1),
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
 * G1 – Go Coordinated
 * goes to a particular position defined by absolute coordinates of all axis. Each motor move independently to position using the currently set max velocities and acceleration. Use this when coordinated moves are not needed
 * Example: Go to absolute pan position 10000, tilt position 20000, M3 position -15000, M4 position 2000 in 1.5 seconds with an acceleration of 0.25seconds on each side.
 * G1 X10000 Y20000 Z-15000 W2000 T1.5 A0.25
 * Move to:X10000,Y20000,Z-15000,W2000
 * Notes –
 * • Virtual Stops are not adhered to when using G0 and G1.
 * • If the move cannot be achieved in the time required, it will move at the fastest speed possible with the current
 * VMAX and AMAX settings.
 * • If no value is given for an axis, no move command is given to that axis.
 */
ApiV0_1.prototype.g1 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G1 ' + _this.stringifyParams(params, ['x', 'y', 'z', 'w', 't', 'a']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(':')[1].split(',');
      var result = {
        x: String(array[0]).substr(1),
        y: String(array[1]).substr(1),
        z: String(array[2]).substr(1),
        w: String(array[3]).substr(1),
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
 * G2 – Jog Position – Stops enforced
 * Jogs motor a particular number of steps.
 * Example: Jog the following steps Pan 1000, tilt -2000, M3 -1500, M4 2000
 * G2 X1000 Y-2000 Z-1500 W2000
 * Jog by:X1000,Y-2000,Z-1500,W2000
 * Notes:
 * • If you are trying to jog over a stop, it will stop at the stop – expected. If you are already over a stop, it will jog back to the limit.
 */
ApiV0_1.prototype.g2 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G2 ' + _this.stringifyParams(params, ['x', 'y', 'z', 'w']) + '\n';
    _this.port.on('data', function (resp) {
      var array = String(resp).split(':')[1].split(',');
      var result = {
        x: String(array[0]).substr(1),
        y: String(array[1]).substr(1),
        z: String(array[2]).substr(1),
        w: String(array[3]).substr(1),
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
 * G100 – Sets Motor performance
 * This is an advanced command that must be used carefully as this controls power and speeds used by the ST4’s motors. Do not sets maxes on any axis at a default. It is recommended to use the example parameters below and slowly make changes.
 * Parameters
 * 1. M-Motor–M–1-4,M1Pan,M2,Tilt,M3,M4
 * 2. D - moDe 1 for normal, 2 for quiet
 * 3. V - VMAX: 1 to 600000, positive integer values only
 * 4. A - AMAX: 1 to 65535, positive integer values only
 * 5. R - Power During Run: 1 to 15 positive integer values only
 * 6. S - Power During Stop: 0 to 5 positive integer values only
 * Example: Set the pan axis VMAX to 150000, AMAX 5000, Current During run of 8, Current while stationary of 3.
 * G100 M1 D1 V150000 A4000 R8 S3
 * Motor performance set for Pan
 * G100 M2 D1 V300000 A7000 R10 S2
 * Motor performance set for Tilt
 * G100 M3 D1  V400000 A6000 R10 S5
 * Motor performance set for M3
 * G100 M4 D1  V250000 A5000 R13 S1
 * Motor performance set for M4
 * Note, It is not recommended or allowed to set the value of R higher than 15, or S higher than 5.
 * max power for run or hold uses a high amount of current and can trip overcurrent protection or produce excessive heat in the spectrum st4. Although no indication in the return value is shown, the high limits are enforced.
 *
 * - See understanding V and A values for a motor.
 */
ApiV0_1.prototype.g100 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G100 ' + _this.stringifyParams(params, ['m', 'd', 'v', 'a', 'r', 's']) + '\n';
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
 * G200 - Set Motor Position
 * Sets the internal motor position to a value. This is good for zeroing a particular axis; Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * 2. P ( Optional) Position: any singed 32 bit integer number between - 2100000000 to 2100000000, If not entered,
 * 0 will be defaulted.
 * Examples:
 * G200 M1 P10000
 * Pan position set to:10000
 * G200 M1 P0
 * Pan position set to:0
 * G200 M2 P300
 * Tilt position set to:300
 * G200 M2
 * Tilt position set to:0
 */
ApiV0_1.prototype.g200 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G200 ' + _this.stringifyParams(params, ['m', 'p']) + '\n';
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
 * G201 - Zero All Motors
 * Sets all motors to zero
 * Parameters: None
 * Example:
 * G201
 * All Motors Zeroed
 */
ApiV0_1.prototype.g201 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G201\n';
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
 * G211 – Set Motor Virtual STOPA to a value or clear
 * Sets internal Stop A, one side of virtual Stop – use this for the lower value. Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * 2. Position: (optional) any integer number -2100000000 to 2100000000, if left clear, this will set the STOPB to the
 * STOPA to the minimum value, clearing the stop in practice
 * Example: Set Tilt Virtual Stop A to -588800, then clear it.
 * G211 M2 P-588800
 * Tilt Virtual StopA set to:-588800
 * G211 M2
 * Tilt Virtual StopA set to:-2100000000
 * Note:
 * • Virtual StopA must be lower in value than Virtual StopB
 */
ApiV0_1.prototype.g211 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G211 ' + _this.stringifyParams(params, ['m', 'p']) + '\n';
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
 * G212 – Set Motor Virtual STOPB to a value or clear
 * Sets internal Stop B, one side of virtual Stop – use this for the higher value. Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * 2. Position: (optional) any integer number -2100000000 to 2100000000, if left clear, this will set the STOPB to the
 * maximum value, clearing the stop in practice
 * Example: Set Tilt Virtual Stop B to 120000, then clear it.
 * G212 M2 P120000
 * Tilt Virtual StopB set to:120000
 * G212 M2
 * Tilt Virtual StopB set to:2100000000
 * Note:
 * • Virtual Stop Amust be lower in value than Virtual StopB
 */
ApiV0_1.prototype.g212 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G212 ' + _this.stringifyParams(params, ['m', 'p']) + '\n';
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
 * G213 – Set Motor Virtual STOPA to the current position
 * This reads the current position and set STOPA to the current position for the requested motor. Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * Example: Move to a known position (stops not adhered to and set virtual stop for M3 Virtual Stop A to that position.
 * G1 X10000 Y20000 Z-15000 W2000 T1.5 A0.25
 * Move to:X10000,Y20000,Z-15000,W2000
 * G213 M3
 * M3 Virtual StopA set to:-15000
 * Note:
 * • Virtual Stop Amust be lower in value than Virtual StopB
 */
ApiV0_1.prototype.g213 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G213 ' + _this.stringifyParams(params, ['m']) + '\n';
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
 * G214 – Set Motor Virtual STOPB to the current position
 * This reads the current position and set STOPB to the current position for the requested motor. Parameters
 * 1. M-Motor:1forPan,2forTilt,3forM3,4forM4
 * Example: Move to a known position (stops not adhered to and set virtual stop for M3 Virtual Stop B to that position.
 * G1 X10000 Y20000 Z45000 W2000 T1.5 A0.25
 * Move to:X10000,Y20000,Z45000,W2000
 * G214 M3
 * M3 Virtual StopB set to:45000
 * Note:
 * • Virtual Stop Amust be lower in value than Virtual StopB
 */
ApiV0_1.prototype.g214 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G214 ' + _this.stringifyParams(params, ['m']) + '\n';
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
 * G300 – Sets Motor Velocity
 * This is inherently a dangerous command as by setting a motor velocity, it will continue to run until it hits it virtual stops unless another command is given to stop it. Use with care. Velocities are limited to 600000.
 * Parameters
 * 1. M-Motor–M–1-4,M1Pan,M2,Tilt,M3,M4
 * 2. V - Velocity: -600000 to 600000 Example:
 * G212 M3 P1
 * M3 Virtual StopB set to:1
 * G300 M3 V100000
 * Velocity Move: M3 100000
 * G211 M3 P-100000
 * M3 Virtual StopA set to:-100000
 * G300 M3 V-100000
 * Velocity Move: M3 -100000
 * Note;
 * If a value of velocity is passed in that is greater than 100000, it will be defaulted to zero
 */
ApiV0_1.prototype.g300 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G300 ' + _this.stringifyParams(params, ['m', 'v']) + '\n';
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
 * G500 – Status - What’s moving and location
 * Returns has 5 parameters:
 * 4digit set – Is moving flag for Pan,Tilt,M3,M4. 1 indicates moving, 0 indicates still
 * The next 4 parameters are the current location of each of the Pan, Tilt, M3, and M4 Values. In the example below, no motor is moving, and the pan value is 11297, tilt value is 132545, M3 4530 and M4 -26249.
 * G500
 * 0000 11297,132545,4540,-26249
 */
ApiV0_1.prototype.g500 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (data)
    {
      var movingSet = String(data).split(' ')[0];
      var locationSet = String(data).split(' ')[1];
      resolve({
        isMoving: function () {return parseInt(movingSet) > 0;},
        moving: {
          pan: parseInt(movingSet.substring(0, 0)) > 0,
          tilt: parseInt(movingSet.substring(1, 1)) > 0,
          m3: parseInt(movingSet.substring(2, 2)) > 0,
          m4: parseInt(movingSet.substring(3, 3)) > 0,
          toString: function () {return movingSet;}
        },
        locations: {
          pan: parseInt(String(locationSet).split(',')[0]),
          tilt: parseInt(String(locationSet).split(',')[1]),
          m3: parseInt(String(locationSet).split(',')[2]),
          m4: parseInt(String(locationSet).split(',')[3]),
          toString: function () {return locationSet;}
        },
        toString: function () {return String(data);}
      });
    });
    _this.port.write('G500\n');
  });
}

/**
 * G911 – Stop All Motors
 * Initiates a hard stop of all motors. This is not depowering, but decelerating quickly. This should not be used as a general stop, but as an emergency stop.
 * Example:
 * G911
 */
ApiV0_1.prototype.g911 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (resp) {
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write('G911\n');
  });
}

/**
 * CAMERA CONTROL GROUP
 * Series of commands to interact with the camera triggering this.port. This could be fire a shot, focus, or fire a shot with a specific amount of time.
 */

/**
 * G400 – Trigger Shutter/Focus NOW
 * Trigger Focus and Shutter for a set period of MS Parameters
 *
 * Parameters
 *    1. S -Shutter: - time in ms of Shutter Trigger
 *
 * Example:
 * G400 S2000
 * Shutter/Focus 2000ms
 * G400 S150
 * Shutter/Focus 150ms
 */
ApiV0_1.prototype.g400 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G400 ' + _this.stringifyParams(params, ['s']) + '\n';
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
 * G410 – Focus Off
 * Turn off Focus
 *
 * Parameters - none
 *
 * Example:
 * G410
 * Focus Off
 */
ApiV0_1.prototype.g410 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (resp) {
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write('G410\n');
  });
}

/**
 * G411 – Focus On
 * Turn on Focus
 *
 * Parameters - none
 *
 * Example:
 * G411
 * Focus On
 */
ApiV0_1.prototype.g411 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (resp) {
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write('G411\n');
  });
}

/**
 * G420 – Shutter Off
 * Turn off Shutter
 *
 * Parameters - none
 *
 * Example:
 * G420 S150
 * Shutter Off
 */
ApiV0_1.prototype.g420 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G420 ' + _this.stringifyParams(params, ['s']) + '\n';
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
 * G421 – Shutter On
 * Turn on Shutter
 *
 * Parameters - none
 *
 * Example:
 * G421 S2000
 * Shutter On
 */
ApiV0_1.prototype.g421 = function(params) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    var command = 'G421 ' + _this.stringifyParams(params, ['s']) + '\n';
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
 * PROGRAMMED SHOTS GROUP
 */

/**
 * G600 – Export Move from RAM
 * Returns the move parameters and the line by line export of the move. Example:
 * G600
 * <Placeholder, response very large>
 */
ApiV0_1.prototype.g600 = function() {
  var _this = this;
  return new Promise(function (resolve, reject) {
    _this.port.on('data', function (resp) {
      var result = {
        toString: function () {
          return String(resp);
        }
      };
      resolve(result);
    });
    _this.port.write('G600\n');
  });
}

module.exports = ApiV0_1;
