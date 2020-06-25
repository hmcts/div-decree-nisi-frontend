const { shimSessionInterstitial } = require('middleware/shimSession');
const config = require('config');
const { branch, redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const { getFeeFromFeesAndPayments, feeTypes } = require('middleware/feesAndPaymentsMiddleware');
const { createUris } = require('@hmcts/div-document-express-handler');
const checkCaseState = require('middleware/checkCaseState');
const { get } = require('lodash');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification, dnIsRefused } = require('common/constants');
const caseOrchestrationService = require('services/caseOrchestrationService');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

const {
  caseStateMap,
  permitDNReasonMap,
  caseIdDisplayStateMap,
  awaitingPronouncementWithHearingDateTemplate
} = require('./petitionerStateTemplates');

const constants = {
  adultery: 'adultery',
  sep2Yr: 'separation-2-years',
  AOSCompleted: 'aoscompleted',
  AOSOverdue: 'aosoverdue',
  validAnswer: ['yes', 'no', 'nonoadmission'],
  notDefined,
  DNAwaiting: 'awaitingdecreenisi',
  awaitingPronouncement: 'awaitingpronouncement',
  awaitingClarification,
  dnIsRefused,
  undefendedReason: '0',
  no: 'no',
  yes: 'yes'
};

class PetitionProgressBar extends shimSessionInterstitial {
  static get path() {
    return config.paths.petitionProgressBar;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
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
      getFeeFromFeesAndPayments(feeTypes.amendFee),
      checkWelshToggle
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

  get showCourtFeedback() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === constants.awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
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

  get dnIsRefused() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.dnIsRefused);
    const isCorrectState = this.caseState === constants.dnIsRefused;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get showReviewAosResponse() {
    const respWillDefendDivorce = this.respWillDefendDivorce && constants.validAnswer
      .includes(this.respWillDefendDivorce.toLowerCase());
    const isTwoYrSep = this.reasonForDivorce === constants.sep2Yr;

    return respWillDefendDivorce || this.aosIsCompleted || isTwoYrSep;
  }

  awaitingPronouncementWithHearingDate() {
    const isAwaitingPronouncement = this.caseState === constants
      .awaitingPronouncement;
    const hearingDates = get(this.case, 'hearingDate') || [];

    return isAwaitingPronouncement && hearingDates.length;
  }

  get certificateOfEntitlementFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'certificateOfEntitlement';
    });
  }

  get refusalOrderFile() {
    return this.downloadableFiles.find(file => {
      const isRefusalOrder = [
        'clarificationDnRefusalOrder',
        'rejectionDnRefusalOrder'
      ].includes(file.type);
      return isRefusalOrder;
    });
  }

  next() {
    if (this.dnIsRefused) {
      return action(caseOrchestrationService.amendRejectedApplication)
        .then(redirectToFrontendHelper.redirectToFrontendAmend);
    }

    return branch(
      redirectTo(this.journey.steps.CourtFeedback)
        .if(this.showCourtFeedback),
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
    } else if (this.awaitingPronouncementWithHearingDate()) {
      template = awaitingPronouncementWithHearingDateTemplate;
    } else {
      caseStateMap(this.case).forEach(dataMap => {
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

  get costsOrderFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'costsOrder';
    });
  }

  get decreeNisiFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'decreeNisi';
    });
  }
}

module.exports = PetitionProgressBar;
