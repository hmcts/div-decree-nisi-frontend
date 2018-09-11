const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');

class DoesNotWantToContinue extends ExitPoint {
  static get path() {
    return config.paths.doesNotWantToContinue;
  }
}

module.exports = DoesNotWantToContinue;
