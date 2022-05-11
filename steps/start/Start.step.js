const { Redirect, branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Start extends Redirect {
  static get path() {
    return config.paths.index;
  }

  next() {
    const hasSession = () => {
      return this.req.session && this.req.session.case;
    };

    return branch(
      redirectTo(this.journey.steps.PetitionProgressBar).if(hasSession),
      redirectTo(this.journey.steps.Entry)
    );
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = Start;
