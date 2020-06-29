const { shimSessionStaticPage } = require('middleware/shimSession');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');

class ContactDivorceTeam extends shimSessionStaticPage {
  static get path() {
    return config.paths.contactDivorceTeam;
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ContactDivorceTeam;
