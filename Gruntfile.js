/*jshint camelcase: false */

'use strict';

module.exports = function (grunt) {

	// Load multiple grunt tasks using globbing patterns
	// https://github.com/sindresorhus/load-grunt-tasks
	require('load-grunt-tasks')(grunt);

	// load modular grunt configuration
	// https://github.com/firstandthird/load-grunt-config
	require('load-grunt-config')(grunt);

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'mochacli']);

	// tests task(s).
	grunt.registerTask('test', ['mochacli']);

	// code coverage task(s).
	grunt.registerTask('coverage', ['mocha_istanbul']);
};
