/* global describe, it, expect, Promise */
'use strict';

var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var Api = require('../lib/ApiV0_105');

function buildFakePort() {
  var fake = new EventEmitter();
  fake.write = sinon.spy();
  return fake;
}

/**
 * Specification for emotimo-st4
 */
describe('eMotimo ST4 API', function () {
  describe('v0.105', function () {
    it('should be new-able class', function () {
      var fakePort = buildFakePort();
      var api = new Api(fakePort);

      expect(api).to.be.ok;
    });

    describe('version', function () {
      it('should be expected version number', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        expect(api.version).to.be.equal(0.105);
      });
    });

    describe('G215 – Query Motor Virtual STOPA', function () {
      it('should exist', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        expect(api.g215).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G215 M3\n';
        api.g215({m: '3'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g215({m: '3'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g215({m: '3'})
          .then(function (args) {
            expect(args.toString).to.be.ok;
            expect(args.toString()).to.equal('M3 Virtual StopA set to:-15000');
            done();
          });

        // assumes pervious step: Move to:X10000,Y20000,Z-15000,W2000
        fakePort.emit('data', 'M3 Virtual StopA set to:-15000');
      });
    });

    describe('G216 – Query Motor Virtual STOPB', function () {
      it('should exist', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        expect(api.g216).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G216 M3\n';
        api.g216({m: '3'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g216({m: '3'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g216({m: '3'})
          .then(function (args) {
            expect(args.toString).to.be.ok;
            expect(args.toString()).to.equal('M3 Virtual StopB set to:45000');
            done();
          });

        // assumes pervious step: Move to:X10000,Y20000,Z45000,W2000
        fakePort.emit('data', 'M3 Virtual StopB set to:45000');
      });
    });
  });
});
