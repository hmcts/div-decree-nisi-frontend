/* eslint-disable no-console, no-process-env */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const config = require('config');

const processEnvironmentSetup = require('@hmcts/node-js-environment-variable-setter');

if (process.env.POINT_TO_REMOTE) {
  const configurationFile = './remote-config.json';
  processEnvironmentSetup.setUpEnvironmentVariables(configurationFile);
}

const waitForTimeout = config.saucelabs.waitForTimeout;
const smartWait = config.saucelabs.smartWait;


const browser = process.env.SAUCE_BROWSER || config.saucelabs.browser;
const tunnelName = process.env.SAUCE_TUNNEL_IDENTIFIER || config.saucelabs.tunnelId;
const getBrowserConfig = browserGroup => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
      desiredCapability.tunnelIdentifier = tunnelName;
      desiredCapability.tags = ['DN_divorce'];
      browserConfig.push({
        browser: desiredCapability.browserName,
        desiredCapabilities: desiredCapability
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
};

const setupConfig = {
  tests: './paths/intergration.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    WebDriverIO: {
      url: process.env.E2E_FRONTEND_URL || config.tests.functional.url,
      browser,
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      user: process.env.SAUCE_USERNAME || config.saucelabs.username,
      key: process.env.SAUCE_ACCESS_KEY || config.saucelabs.key,
      desiredCapabilities: {}
    },
    SauceLabsReportingHelper: { require: './helpers/SauceLabsReportingHelper.js' },
    JSWait: { require: './helpers/JSWait.js' },
    IdamHelper: { require: './helpers/idamHelper.js' },
    CaseHelper: { require: './helpers/caseHelper.js' },
    UrlHelper: { require: './helpers/urlHelper.js' }
  },
  include: { I: './pages/steps.js' },
  mocha: {
    reporterOptions: {
      reportDir: `${process.cwd()}/functional-output`,
      reportName: 'index',
      inlineAssets: true
    }
  },
  multiple: {
    microsoftIE11: {
      browsers: getBrowserConfig('microsoftIE11')
    },
    microsoftEdge: {
      browsers: getBrowserConfig('microsoftEdge')
    },
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    },
    safari: {
      browsers: getBrowserConfig('safari')
    }
  },
  name: 'DN Frontend Tests'
};

exports.config = setupConfig;
