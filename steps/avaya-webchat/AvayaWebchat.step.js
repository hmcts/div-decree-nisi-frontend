const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class AvayaWebchat extends Page {
  static get path() {
    return config.paths.avayaWebchat;
  }
}

module.exports = AvayaWebchat;
