<div align="center">
   <a href="https://emotimo.com/"><img src="static/logos/eMotimo.png" alt="eMotimo logo" /></a>
</div>

# node-emotimo-st4

[![NPM version](https://img.shields.io/npm/v/emotimo-st4.svg)](https://www.npmjs.com/package/emotimo-st4)
[![Build Status](https://travis-ci.org/haysclark/node-emotimo-st4.svg)](https://travis-ci.org/haysclark/node-emotimo-st4)
[![Coverage Status](https://coveralls.io/repos/haysclark/node-emotimo-st4/badge.svg?service=github)](https://coveralls.io/github/haysclark/node-emotimo-st4)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

An unofficial [eMotimo spectrum ST4](https://emotimo.com/pages/spectrum) API wrapper for NodeJS.

## Installation

Install and add to `dependencies`:

```
npm i --save emotimo-st4
```

## Usage

Require eMotimo API module.

```js
var emotimo = require('emotimo-st4');
```

Create SerialPort instance with createPort() factory method, providing your port path.  Then create eMotimo API instance using api() factory method, providing you SerialPort instance.

```js
var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');
var api = emotimo.api(port);
```

Optionally, create specific version eMotimo API instance, but providing version number to api() factory method.

```js
var port = emotimo.createPort('/dev/tty.SLAB_USBtoUART');
var api = emotimo.api(port, 'v0.104');
```

### Calling eMotimo API commands
To call any eMotimo API, simply call the API ID with a lowercase letter and the number.

### Providing eMotimo API command arguments
All API arguments are provided as an argument object, as many eMotimo API's arguments are optional.

### eMotimo API command responses
All API calls return a Promise which resolve with an Object. Some API response are parsed for convenience, yet the RAW API output is always available via the ```toString()``` method.

### Example eMotimo API call of G215 (Query Motor Virtual STOPA)
Calling the eMotimo API command G215 (_Query Motor Virtual STOPA_) would translate to: ```api.g215()```. To specify Motor3, you would normally append 'M3' to the command, so in JS you would provide a param object like this: ```{m: 3}```.

```js 
api.g215({m: 3}) // writes to SerialPort: "G215 M3"
.then(function(response) {
  console.log(response.toString()); // Output: "M3 Virtual StopA set to:[current M3 value]"
});
```

## Tests

```
npm test
npm run coverage
```

## Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

The project uses [Conventional Commits](https://conventionalcommits.org/) which are simple and easy to follow. In general, use your best judgment, and feel free to propose changes by creating an issue and then mention the issue in your pull request.

## License

MIT
