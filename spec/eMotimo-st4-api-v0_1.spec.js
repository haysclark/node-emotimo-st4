/* global describe, it, expect, Promise */
'use strict';

var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var Api = require('../lib/ApiV0_1');

function buildFakePort() {
  var fake = new EventEmitter();
  fake.write = sinon.spy();
  return fake;
}

/**
 * Specification for emotimo-st4
 */
describe('eMotimo ST4 API', function () {
  describe('v0.1', function () {
    it('should be new-able class', function () {
      var fakePort = {};
      var api = new Api(fakePort);

      expect(api).to.be.ok;
    });

    describe('version', function () {
      it('should be expected version number', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.version).to.be.equal(0.1);
      });
    });

    describe('toString()', function () {
      it('should be expected version number', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        expect(api.toString).to.be.ok;
        expect(api.toString()).to.be.equal('eMotimo ST4 API v' + api.version);
      });
    });

    describe('stringifyParams', function () {
      it('should return uppercase property string', function () {
        var fakePort = {};
        var api = new Api(fakePort);
        var result = api.stringifyParams({x: '100', y: '200', z: '300'}, ['x', 'y']);

        expect(result).to.not.be.equal('X100 Y200 Z300');
        expect(result).to.be.equal('X100 Y200');
      });
    });

    describe('waitForStop', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.waitForStop).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G500\n';
        api.waitForStop();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with G500 to check motor status', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G500\n';
        api.waitForStop();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.waitForStop();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with arguments if motor is stopped', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);
        var payload = {};

        api.waitForStop(payload)
          .then(function (args) {
            expect(args).to.be.equal(payload);
            done();
          });

        fakePort.emit('data', '0000 11297,132545,4540,-26249');
      });

      it('should requery motor status if not stopped', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);
        var payload = {};

        var expected = 'G500\n';
        api.waitForStop(payload)
          .then(function () {
            expect(fakePort.write.callCount).to.be.equal(2);
            expect(fakePort.write.getCall(1).args[0]).to.be.equal(expected);
            done();
          });

        fakePort.emit('data', '0100 11297,32545,4540,-26249');
        fakePort.emit('data', '0000 11297,132545,4540,-26249');
      });
    });

    describe('G0 – Go Rapid', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g0).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G0 X10000 Y20000 Z-15000 W2000\n';
        api.g0({x: '10000', y: '20000', z: '-15000', w: '2000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with only specified properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G0 W400\n';
        api.g0({a: '100', b: '200', c: '300', w: '400'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g0({a: '100', b: '200', c: '300', w: '400'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g0({x: '10000', y: '20000', z: '-15000', w: '2000'})
          .then(function (args) {
            expect(args.x).to.be.ok;
            expect(args.x).to.equal('10000');
            expect(args.y).to.be.ok;
            expect(args.y).to.equal('20000');
            expect(args.z).to.be.ok;
            expect(args.z).to.equal('-15000');
            expect(args.w).to.be.ok;
            expect(args.w).to.equal('2000');
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Rapid to:,X10000,Y20000,Z-15000,W2000');
            done();
          });

        fakePort.emit('data', 'Rapid to:,X10000,Y20000,Z-15000,W2000');
      });
    });

    describe('G1 – Go Coordinated', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g1).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G1 X10000 Y20000 Z-15000 W2000 T1.5 A0.25\n';
        api.g1({x: '10000', y: '20000', z: '-15000', w: '2000', t: '1.5', a: '0.25'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with only specified properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G1 W400 A100\n';
        api.g1({a: '100', b: '200', c: '300', w: '400'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g1({a: '100', b: '200', c: '300', w: '400'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g1({x: '10000', y: '20000', z: '-15000', w: '2000', t: '1.5', a: '0.25'})
          .then(function (args) {
            expect(args.x).to.be.ok;
            expect(args.x).to.equal('10000');
            expect(args.y).to.be.ok;
            expect(args.y).to.equal('20000');
            expect(args.z).to.be.ok;
            expect(args.z).to.equal('-15000');
            expect(args.w).to.be.ok;
            expect(args.w).to.equal('2000');
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Move to:X10000,Y20000,Z-15000,W2000');
            done();
          });

        fakePort.emit('data', 'Move to:X10000,Y20000,Z-15000,W2000');
      });
    });

    describe('G2 – Jog Position – Stops enforced', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g2).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G2 X1000 Y-2000 Z-1500 W2000\n';
        api.g2({x: '1000', y: '-2000', z: '-1500', w: '2000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with only specified properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G2 W2000\n';
        api.g2({a: '1000', b: '-2000', c: '-1500', w: '2000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g2({a: '1000', b: '-2000', c: '-1500', w: '2000'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g2({x: '1000', y: '-2000', z: '-1500', w: '2000'})
          .then(function (args) {
            expect(args.x).to.be.ok;
            expect(args.x).to.equal('1000');
            expect(args.y).to.be.ok;
            expect(args.y).to.equal('-2000');
            expect(args.z).to.be.ok;
            expect(args.z).to.equal('-1500');
            expect(args.w).to.be.ok;
            expect(args.w).to.equal('2000');
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Jog by:X1000,Y-2000,Z-1500,W2000');
            done();
          });

        fakePort.emit('data', 'Jog by:X1000,Y-2000,Z-1500,W2000');
      });
    });

    describe('G100 – Sets Motor performance', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g100).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G100 M1 D1 V150000 A4000 R8 S3\n';
        api.g100({m: '1', d: '1', v: '150000', a: '4000', r: '8', s: '3'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g100({m: '1', d: '1', v: '150000', a: '4000', r: '8', s: '3'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g100({m: '1', d: '1', v: '150000', a: '4000', r: '8', s: '3'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Motor performance set for Pan');
            done();
          });

        fakePort.emit('data', 'Motor performance set for Pan');
      });
    });

    describe('G200 - Set Motor Position', function () {
      it('should exist', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        expect(api.g200).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G200 M1 P10000\n';
        api.g200({m: '1', p: '10000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should call port with only specified properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G200 M2\n';
        api.g200({m: '2'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g200({m: '2'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g200({m: '2', p: '10000'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Pan position set to:10000');
            done();
          });

        fakePort.emit('data', 'Pan position set to:10000');
      });
    });

    describe('G201 - Zero All Motors', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g201).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G201\n';
        api.g201();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g201();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g201({m: '2', p: '10000'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('All Motors Zeroed');
            done();
          });

        fakePort.emit('data', 'All Motors Zeroed');
      });
    });

    describe('G211 – Set Motor Virtual STOPA to a value or clear', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g211).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G211 M2 P-588800\n';
        api.g211({m: '2', p: '-588800'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g211({m: '2', p: '-588800'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g211({m: '2', p: '-588800'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Tilt Virtual StopA set to:-588800');
            done();
          });

        fakePort.emit('data', 'Tilt Virtual StopA set to:-588800');
      });
    });

    describe('G212 – Set Motor Virtual STOPB to a value or clear', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g212).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G212 M2 P120000\n';
        api.g212({m: '2', p: '120000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g212({m: '2', p: '120000'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g212({m: '2', p: '120000'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Tilt Virtual StopB set to:120000');
            done();
          });

        fakePort.emit('data', 'Tilt Virtual StopB set to:120000');
      });
    });

    describe('G213 – Set Motor Virtual STOPA to the current position', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g213).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G213 M3\n';
        api.g213({m: '3'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g213({m: '3'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g213({m: '3'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('M3 Virtual StopA set to:-15000');
            done();
          });

        // assuming previous step was: Move to:X10000,Y20000,Z-15000,W2000
        fakePort.emit('data', 'M3 Virtual StopA set to:-15000');
      });
    });

    describe('G214 – Set Motor Virtual STOPB to the current position', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g214).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G214 M3\n';
        api.g214({m: '3'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g214({m: '3'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g214({m: '3'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('M3 Virtual StopB set to:45000');
            done();
          });

        // assuming previous step was: Move to:X10000,Y20000,Z45000,W2000
        fakePort.emit('data', 'M3 Virtual StopB set to:45000');
      });
    });

    describe('G300 – Sets Motor Velocity', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g300).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G300 M3 V-100000\n';
        api.g300({m: '3', v: '-100000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g300({m: '3', v: '-100000'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g300({m: '3', v: '-100000'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Velocity Move: M3 -100000');
            done();
          });

        fakePort.emit('data', 'Velocity Move: M3 -100000');
      });
    });

    describe('G500 – Status - What’s moving and location', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g500).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G500\n';
        api.g500();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g500();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g500()
          .then(function (args) {
            expect(args.isMoving).to.be.ok;
            expect(args.isMoving()).to.be.false;
            expect(args.moving.pan).to.equal(false);
            expect(args.moving.tilt).to.equal(false);
            expect(args.moving.m3).to.equal(false);
            expect(args.moving.m4).to.equal(false);
            expect(args.moving.toString()).to.equal('0000');
            expect(args.locations).to.be.ok;
            expect(args.locations.pan).to.equal(11297);
            expect(args.locations.tilt).to.equal(132545);
            expect(args.locations.m3).to.equal(4540);
            expect(args.locations.m4).to.equal(-26249);
            expect(args.locations.toString()).to.equal('11297,132545,4540,-26249');
            expect(args.toString).to.be.ok;
            expect(args.toString()).to.equal('0000 11297,132545,4540,-26249');
            done();
          });

        fakePort.emit('data', '0000 11297,132545,4540,-26249');
      });
    });

    describe('G911 – Stop All Motors', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g911).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G911\n';
        api.g911();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g911();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g911()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Stop All Initiated');
            done();
          });

        fakePort.emit('data', 'Stop All Initiated');
      });
    });

    describe('G400 – Trigger Shutter/Focus NOW', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g400).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G400 S2000\n';
        api.g400({s: '2000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g400({s: '2000'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g400({s: '2000'})
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Shutter/Focus 2000ms');
            done();
          });

        fakePort.emit('data', 'Shutter/Focus 2000ms');
      });
    });

    describe('G410 – Focus Off', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g410).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G410\n';
        api.g410();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g410();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g410()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Focus Off');
            done();
          });

        fakePort.emit('data', 'Focus Off');
      });
    });

    describe('G411 – Focus On', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g411).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G411\n';
        api.g411();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g411();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g411()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Focus On');
            done();
          });

        fakePort.emit('data', 'Focus On');
      });
    });

    describe('G420 – Shutter Off', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g420).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G420 S150\n';
        api.g420({s: '150'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g420({s: '150'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g420()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Shutter Off');
            done();
          });

        fakePort.emit('data', 'Shutter Off');
      });
    });

    describe('G421 – Shutter On', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g421).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G421 S2000\n';
        api.g421({s: '2000'});

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g421({s: '2000'});

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g421()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Shutter On');
            done();
          });

        fakePort.emit('data', 'Shutter On');
      });
    });

    describe('G600 – Export Move from RAM', function () {
      it('should exist', function () {
        var fakePort = {};
        var api = new Api(fakePort);

        expect(api.g600).to.be.ok;
      });

      it('should call port with expected properties', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var expected = 'G600\n';
        api.g600();

        expect(fakePort.write.called).to.be.ok;
        expect(fakePort.write.getCall(0).args[0]).to.be.equal(expected);
      });

      it('should return Promise', function () {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        var result = api.g600();

        expect(result instanceof Promise).to.be.true;
      });

      it('should resolve Promise with parsed arguments object', function (done) {
        var fakePort = buildFakePort();
        var api = new Api(fakePort);

        api.g600()
          .then(function (args) {
            expect(args.toString()).to.be.ok;
            expect(args.toString()).to.equal('Total Shots:0\nFramerate:24\n/x1A');
            done();
          });

        fakePort.emit('data', 'Total Shots:0\nFramerate:24\n/x1A');
      });
    });
  });
});
