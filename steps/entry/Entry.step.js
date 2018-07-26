const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return redirectTo(this.journey.steps.Start);
  }

  get middleware() {
    return [...super.middleware];
  }
}

module.exports = Entry;
