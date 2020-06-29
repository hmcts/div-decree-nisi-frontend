const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');

class ContactDivorceTeamError extends shimSessionStaticPage {
  static get path() {
    return config.paths.contactDivorceTeamError;
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ContactDivorceTeamError;
