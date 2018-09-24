/* global describe, it, expect, Promise */
'use strict';

var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var Api = require('../lib/ApiV0_104');

function buildFakePort() {
  var fake = new EventEmitter();
  fake.write = sinon.spy();
  return fake;
}

/**
 * Specification for emotimo-st4
 */
describe('eMotimo ST4 API', function () {
  describe('v0.104', function () {
    it('should be new-able class', function () {
      var fakePort = {};
      var api = new Api(fakePort);

      expect(api).to.be.ok;
    });

    describe('version', function () {
      it('should be expected version number', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.version).to.be.equal(0.104);
      });
    });

    describe('G700 – Returns current firmware Version', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g700).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G700\n';
        api.g700();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g700();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g700()
          .then(function (args) {
            expect(args.model).to.equal('ST4');
            expect(args.version).to.equal('RC007.36');
            expect(args.toString).to.be.ok;
            expect(args.toString()).to.equal('Version: ST4_RC007_36');
            done();
          });

        fakePort.emit('data', 'Version: ST4_RC007_36');
      });
    });

    describe('G710 – Turn off Pre/Post amble', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g710).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G710 S1\n';
        api.g710({s: '1'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with minimal properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G710 \n';
        api.g710();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g710();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g710()
          .then(function (args) {
            expect(args.model).to.equal('ST4');
            expect(args.version).to.equal('RC007.36');
            expect(args.toString).to.be.ok;
            expect(args.toString()).to.equal('Version: ST4_RC007_36');
            done();
          });

        fakePort.emit('data', 'Version: ST4_RC007_36');
      });
    });
  });
});
