'use strict';

/**
 * Argument Required Error
 *
 * @constructor
 * @param {string} message - custom error message.
 */
function ArgumentRequiredError(argumentName) {
  this.name = "ArgumentRequired";
  this.message = "'" + argumentName + "' argument is required";
}
ArgumentRequiredError.prototype = new Error();
ArgumentRequiredError.prototype.constructor = ArgumentRequiredError;

module.exports = ArgumentRequiredError;
