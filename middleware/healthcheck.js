const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const os = require('os');

const checks = () => {
  return {};
};

const setupHealthChecks = app => {
  app.use(config.paths.health, healthcheck.configure({
    checks: checks(),
    buildInfo: {
      name: config.service.name,
      host: os.hostname(),
      uptime: process.uptime()
    }
  }));
};

module.exports = setupHealthChecks;
