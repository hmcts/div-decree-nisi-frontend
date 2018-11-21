const config = require('config');

const waitForTimeout = config.tests.functional.waitForTimeout;
const waitForAction = config.tests.functional.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

if (config.environment !== 'development') {
  const proxyServer = config.tests.functional.proxy;
  const proxyByPass = config.tests.functional.proxyByPass;
  chromeArgs.push(`--proxy-server=${proxyServer}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
}

exports.config = {
  tests: './smoke/*.js',
  output: config.tests.functional.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.functional.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      restart: false,
      keepCookies: false,
      keepBrowserState: false,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    JSWait: { require: './helpers/JSWait.js' }
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: `${config.tests.functional.outputDir}/smoke-result.xml` }
      }
    }
  },
  name: 'Frontend Smoke Tests'
};
