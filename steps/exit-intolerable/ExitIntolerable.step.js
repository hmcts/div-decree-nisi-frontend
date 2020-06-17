const { Page } = require('@hmcts/one-per-page');
const config = require('config');
const { stopHere } = require('@hmcts/one-per-page/flow');
const i18next = require('i18next');
const commonContent = require('common/content');

class ExitIntolerable extends Page {
  static get path() {
    return config.paths.exitIntolerable;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get flowControl() {
    return stopHere(this);
  }
}

module.exports = ExitIntolerable;
