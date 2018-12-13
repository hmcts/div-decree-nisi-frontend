const modulePath = 'middleware/healthcheck';

const setupHealthChecks = require(modulePath);
const path = require('path');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const logger = require('@hmcts/nodejs-logging')
  .Logger.getLogger(path.resolve('middleware/healthcheck.js'));
const { sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const { OK } = require('http-status-codes');
const redis = require('services/redis');
const request = require('request-promise-native');

const app = {};
let res = {};
let requestStub = {};

describe(modulePath, () => {
  beforeEach(() => {
    requestStub = sinon.stub();
    app.use = sinon.stub();
    sinon.stub(redis, 'ping').resolves('PONG');
    sinon.stub(healthcheck, 'web');
    sinon.stub(healthcheck, 'raw');
    sinon.stub(healthcheck, 'status');
    sinon.stub(logger, 'error');
    sinon.stub(outputs, 'up');
    sinon.stub(request, 'defaults').returns(requestStub);
    res = { status: OK };
  });

  afterEach(() => {
    redis.ping.restore();
    healthcheck.web.restore();
    healthcheck.raw.restore();
    healthcheck.status.restore();
    logger.error.restore();
    outputs.up.restore();
    request.defaults.restore();
  });

  it('set a middleware on the healthcheck endpoint', () => {
    setupHealthChecks(app);
    sinon.assert.calledWith(app.use, config.paths.health);
  });

  describe('redis', () => {
    it('throws an error if healthcheck fails', () => {
      redis.ping.rejects('error');
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.firstCall.args[0];
      return rawPromise()
        .then(() => {
          sinon.assert.calledWith(logger.error, 'Health check failed on redis: error');
        });
    });

    it('passes healthcheck if redis running', () => {
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.firstCall.args[0];
      return rawPromise()
        .then(() => {
          sinon.assert.calledWith(healthcheck.status, true);
        });
    });
  });

  describe('idam-authentication', () => {
    it('passes healthcheck', () => {
      requestStub.resolves(JSON.stringify({ status: 'UP' }));
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.secondCall.args[0];
      return rawPromise()
        .then(() => {
          sinon.assert.calledWith(healthcheck.status, { status: 'UP' });
        });
    });

    it('throws an error if healthcheck returns with bad status', () => {
      requestStub.resolves(JSON.stringify({ status: 'DOWN' }));
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.secondCall.args[0];
      return rawPromise()
        .then(() => {
          sinon.assert.calledWith(healthcheck.status, { status: 'DOWN' });
        });
    });

    it('throws an error if healthcheck responds with bad response code', () => {
      requestStub.rejects('error');
      setupHealthChecks(app);

      const rawPromise = healthcheck.raw.secondCall.args[0];
      return rawPromise()
        .then(() => {
          sinon.assert
            .calledWith(logger.error, 'Health check failed on idam-authentication: error');
        });
    });
  });

  describe('idam-app', () => {
    it('passes healthcheck', () => {
      setupHealthChecks(app);

      const idamCallback = healthcheck.web.firstCall.args[1].callback;
      idamCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if healthcheck fails', () => {
      setupHealthChecks(app);

      const idamCallback = healthcheck.web.firstCall.args[1].callback;
      idamCallback('error');

      sinon.assert.calledWith(logger.error, 'Health check failed on idam-app: error');
    });
  });

  describe('case-orchistration-service', () => {
    it('passes healthcheck', () => {
      setupHealthChecks(app);

      const idamCallback = healthcheck.web.secondCall.args[1].callback;
      idamCallback(null, res);

      sinon.assert.called(outputs.up);
    });

    it('throws an error if healthcheck fails', () => {
      setupHealthChecks(app);

      const idamCallback = healthcheck.web.secondCall.args[1].callback;
      idamCallback('error');

      sinon.assert
        .calledWith(logger.error, 'Health check failed on case-orchistration-service: error');
    });
  });
});
