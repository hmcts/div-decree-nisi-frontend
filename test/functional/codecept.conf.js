/* eslint-disable no-process-env */
const processEnvironmentSetup = require('@hmcts/node-js-environment-variable-setter');

if (process.env.POINT_TO_REMOTE) {
  const configurationFile = './remote-config.json';
  processEnvironmentSetup.setUpEnvironmentVariables(configurationFile);
  process.env.CASE_MAINTENANCE_BASE_URL = 'http://div-cms-aat.service.core-compute-aat.internal';
}

const config = require('config');

const waitForTimeout = config.tests.functional.waitForTimeout;
const waitForAction = config.tests.functional.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

if (config.environment !== 'development') {
  const proxyServer = config.tests.functional.idam.idamTestApiProxy;
  const proxyByPass = config.tests.functional.idam.idamTestProxyByPass;
  chromeArgs.push(`--proxy-server=${proxyServer || ''}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass || ''}`);
}

exports.config = {
  tests: './paths/**/*.js',
  output: config.tests.functional.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.functional.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: true,
      restart: false,
      keepCookies: false,
      keepBrowserState: false,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    ElementExist: { require: './helpers/elementExist.js' },
    CaseHelper: { require: './helpers/caseHelper.js' },
    JSWait: { require: './helpers/JSWait.js' },
    UrlHelper: { require: './helpers/urlHelper.js' }
  },
  include: { I: './pages/steps.js' },
  mocha: {
    reporterOptions: {
      reportDir: process.env.FUNCTIONAL_OUTPUT_DIR || './functional-output',
      reportName: 'DecreeNisiFrontendTests',
      inlineAssets: true
    }
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    }
  },
  name: 'Decree Nisi Frontend Tests'
};
