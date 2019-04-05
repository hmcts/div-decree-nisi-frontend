const { Redirect, branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

class Start extends Redirect {
  static get path() {
    return config.paths.index;
  }

  next() {
    const hasSession = () => {
      return this.req.session && this.req.session.case;
    };

    const nextStep = parseBool(config.features.showSystemMessage) ? this.journey.steps.SystemMessage : this.journey.steps.PetitionProgressBar;

    return branch(
      redirectTo(nextStep).if(hasSession),
      redirectTo(this.journey.steps.Entry)
    );
  }
}

module.exports = Start;
