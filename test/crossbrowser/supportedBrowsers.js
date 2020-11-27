const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
  microsoftIE11: {
    ie11: {
      browserName: 'internet explorer',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'IE11_DECREE_ABSOLUTE',
        screenResolution: '1400x1050'
      }
    }
  },
  microsoftEdge: {
    edge: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Edge_Win10_DECREE_ABSOLUTE'
      }
    }
  },
  safari: {
    safari_mac_latest: {
      browserName: 'safari',
      platformName: 'macOS 10.14',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_SAFARI_LATEST_DECREE_ABSOLUTE',
        seleniumVersion: '3.141.59',
        screenResolution: '1400x1050'
      }
    }
  },
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_CHROME_LATEST_DECREE_ABSOLUTE'
      }
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_CHROME_LATEST_DECREE_ABSOLUTE'
      }
    }
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_FIREFOX_LATEST_DECREE_ABSOLUTE'
      }
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'MAC_FIREFOX_LATEST_DECREE_ABSOLUTE'
      }
    }
  }
};

module.exports = supportedBrowsers;
