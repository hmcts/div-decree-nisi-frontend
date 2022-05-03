const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class ContactDivorceTeamError extends Page {
  static get path() {
    return config.paths.contactDivorceTeamError;
  }

  get flowControl() {
    return stopHere(this);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = ContactDivorceTeamError;
