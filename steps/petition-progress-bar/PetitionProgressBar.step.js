const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  caseStateMap520
} = require('./petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSCompleted: 'aoscompleted',
  AOSOverdue: 'aosoverdue',
  validAnswer: ['yes', 'no', 'nonoadmission'],
  NotDefined: 'notdefined',
  DNAwaiting: 'awaitingdecreenisi',
  undefendedReason: '0',
  no: 'no',
  yes: 'yes'
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

  get isCaseIdToBeDisplayed() {
    return caseIdDisplayStateMap.includes(this.caseState);
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

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get reasonForDivorce() {
    return this.case.reasonForDivorce;
  }

  get respAdmitsToFact() {
    return this.case.respAdmitOrConsentToFact && this.case.respAdmitOrConsentToFact.toLowerCase() === constants.yes;
  }

  get respWillDefendDivorce() {
    return this.case.respWillDefendDivorce && this.case.respWillDefendDivorce.toLowerCase() === constants.yes;
  }

  get showDnNoResponse() {
    return this.caseState === constants.AOSOverdue;
  }

  get showReviewAosResponse() {
    return this.respWillDefendDivorce || this.caseState.toLowerCase() === constants.AOSCompleted;
  }

  next() {
    return branch(
      redirectTo(this.journey.steps.DnNoResponse)
        .if(this.showDnNoResponse),
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(this.showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get dnReason() {
    return this.case.permittedDecreeNisiReason ? this.case.permittedDecreeNisiReason : constants.undefendedReason;
  }

  get stateTemplate() {
    let template = '';

    if (constants.DNAwaiting.includes(this.caseState)) {
      template = permitDNReasonMap.get(this.dnReason);
    } else if (parseBool(config.features.release520)) {
      caseStateMap520.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
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
