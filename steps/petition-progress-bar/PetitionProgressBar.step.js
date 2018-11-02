const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const { caseStateMap, permitDNReasonMap } = require('./petitionerStateTemplates');

const constants = {
  AOSOverdue: 'aosoverdue',
  validAnswer: ['yes', 'no'],
  NotDefined: 'notdefined',
  DNAwaiting: 'dnawaiting',
  undefendedReason: '0'
};

class PetitionProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitionProgressBar;
  }

  get case() {
    return this.req.session.case.data;
  }

  get caseId() {
    return this.req.session.case.caseId;
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  get respDefendsDivorce() {
    return this.case.respDefendsDivorce;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  next() {
    const showDnNoResponse = this.caseState === constants.AOSOverdue;
    const showReviewAosResponse = !showDnNoResponse && this.respDefendsDivorce && constants.validAnswer.includes(this.respDefendsDivorce.toLowerCase());
    return branch(
      redirectTo(this.journey.steps.DnNoResponse)
        .if(showDnNoResponse),
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get dnReason() {
    return this.case.permittedDecreeNisiReason ? this.case.permittedDecreeNisiReason : constants.undefendedReason;
  }

  get stateTemplate() {
    let template = '';
    if (this.caseState === constants.DNAwaiting) {
      template = permitDNReasonMap.get(this.dnReason);
    } else {
      caseStateMap.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
    }
    return template;
  }
}

module.exports = PetitionProgressBar;
