/* eslint-disable no-magic-numbers, no-process-env, no-console */
const config = require('config');
const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

const waitForTimeout = config.services.saucelabs.waitForTimeout;
const smartWait = config.tests.functional.smartWait;
const browser = process.env.SAUCE_BROWSER || config.services.saucelabs.browser;
const tunnelName = process.env.SAUCE_TUNNEL_IDENTIFIER || config.services.saucelabs.tunnelId;

const getBrowserConfig = () => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers) {
    if (candidateBrowser) {
      const desiredCapability = supportedBrowsers[candidateBrowser];
      desiredCapability.tunnelIdentifier = tunnelName;
      desiredCapability.tags = ['divorce'];
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
  tests: './paths/**/*.js',
  output: config.tests.functional.outputDir,
  helpers: {
    WebDriverIO: {
      url: config.tests.functional.url || config.node.baseUrl,
      browser,
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.saucelabs.com',
      port: 80,
      user: process.env.SAUCE_USERNAME || config.services.saucelabs.username,
      key: process.env.SAUCE_ACCESS_KEY || config.services.saucelabs.key,
      desiredCapabilities: {}
    },
    ElementExist: { require: './helpers/elementExist.js' },
    JSWait: { require: './helpers/JSWait.js' },
    SauceLabsReportingHelper: { require: './helpers/SauceLabsReportingHelper.js' }
  },
  include: { I: './pages/steps.js' },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: `${config.tests.functional.outputDir}/result.xml` }
      },
      mochawesome: {
        stdout: `${config.tests.functional.outputDir}/console.log`,
        options: {
          reportDir: config.tests.functional.outputDir,
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    saucelabs: {
      browsers: getBrowserConfig()
    }
  },
  name: 'Frontend Tests'
};

exports.config = setupConfig;
