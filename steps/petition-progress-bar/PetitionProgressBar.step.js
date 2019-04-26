const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const checkCaseState = require('middleware/checkCaseState');
const moment = require('moment');
const { size } = require('lodash');

const {
  awaitingPronouncementMap,
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap
} = require('./petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSCompleted: 'aoscompleted',
  AOSOverdue: 'aosoverdue',
  awaitingPronouncement: 'awaitingpronouncement',
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

  get isHearingDateInPast() {
    let lastHearingDate = null;
    if (size(this.case.hearingDate) > 0) {
      lastHearingDate = moment(
        this.case.hearingDate[this.case.hearingDate.length - 1]
      );
    }

    return lastHearingDate && lastHearingDate.isBefore(moment.now(), 'day');
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

  get respNotAdmitsToFact() {
    return this.case.respAdmitOrConsentToFact && this.case.respAdmitOrConsentToFact.toLowerCase() === constants.no;
  }

  get isCaseAmended() {
    return Boolean(this.case.previousCaseId);
  }

  handler(req, res) {
    req.session.entryPoint = this.name;
    super.handler(req, res);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      checkCaseState,
      getFeeFromFeesAndPayments(feeTypes.amendFee)
    ];
  }

  get amendFee() {
    return this.res.locals.applicationFee ? this.res.locals.applicationFee[feeTypes.amendFee] : '';
  }

  get respWillDefendDivorce() {
    return this.case.respWillDefendDivorce;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : constants.NotDefined;
  }

  get showDnNoResponse() {
    return this.caseState === constants.AOSOverdue;
  }

  get reasonForDivorce() {
    return this.case.reasonForDivorce;
  }

  get aosIsCompleted() {
    return this.caseState === constants.AOSCompleted;
  }

  get showReviewAosResponse() {
    const respWillDefendDivorce = this.respWillDefendDivorce && constants.validAnswer
      .includes(this.respWillDefendDivorce.toLowerCase());
    const isTwoYrSep = this.reasonForDivorce === constants.sep2Yr;

    return respWillDefendDivorce || this.aosIsCompleted || isTwoYrSep;
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

  get doesHearingDateExists() {
    return size(this.case.hearingDate) > 0 ? 'exists' : 'notExists';
  }

  get stateTemplate() {
    let template = '';
    if (constants.DNAwaiting.includes(this.caseState)) {
      template = permitDNReasonMap.get(this.dnReason);
    } else if (constants.awaitingPronouncement.includes(this.caseState)) {
      template = awaitingPronouncementMap.get(this.doesHearingDateExists);
    } else {
      caseStateMap.forEach(dataMap => {
        if (dataMap.state.includes(this.caseState)) {
          template = dataMap.template;
        }
      });
    }
    return template;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList
    };

    return createUris(this.case.d8, docConfig);
  }

  get entitlementToADecreeFileLink() {
    return this.downloadableFiles.find(file => {
      return file.type === 'entitlementToDecree';
    });
  }
}

module.exports = PetitionProgressBar;
