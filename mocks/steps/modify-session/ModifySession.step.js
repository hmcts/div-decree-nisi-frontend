const { Question } = require('@hmcts/one-per-page');
const config = require('config');
const { form, text, list } = require('@hmcts/one-per-page/forms');
const path = require('path');
const express = require('express');

class ModifySession extends Question {
  handler(req) {
    if (req.method === 'POST') {
      this.updateSession(req);
    }
    this.renderPage();
  }

  static bind(app) {
    super.bind(app);

    // add to assets for use on webpage
    app._router.use(
      `${this.pathToBind}/assets/jsoneditor`,
      express.static(path.resolve('./node_modules/jsoneditor/dist'))
    );
  }

  retrieve() {
    const caseData = {};
    if (this.req.session && this.req.session.case) {
      Object.assign(
        caseData,
        this.req.session.case,
        this.req.session.case.data
      );
    }
    const req = { session: { [this.name]: caseData } };
    this.fields = this.form.retrieve(this.name, req);
    return this;
  }

  static get path() {
    return config.paths.mock.modifySession;
  }

  get form() {
    const reasonForDivorce = text;
    const state = text;
    const marriageIsSameSexCouple = text;
    const divorceWho = text;

    const respAgreeToCosts = text;
    const whoPaysCosts = text;
    const respWillDefendDivorce = text;
    const respStatementOfTruth = text;
    const respAdmitOrConsentToFact = text;
    const respJurisdictionAgree = text;
    const reasonForDivorceBehaviourDetails = text;
    const reasonForDivorceDesertionDetails = text;
    const claimsCosts = text;
    const permittedDecreeNisiReason = text;
    const respConsiderFinancialSituation = text;
    const respHardshipDefenseResponse = text;
    const respLegalProceedingsExist = text;
    const respHardshipDescription = text;
    const respJurisdictionDisagreeReason = text;
    const respJurisdictionRespCountryOfResidence = text;
    const respLegalProceedingsDescription = text;
    const respCostsReason = text;
    const reasonForDivorceAdulteryDetails = text;

    const refusalClarificationReason = list(text);
    const refusalClarificationAdditionalInfo = text;

    const refusalRejectionReason = list(text);
    const refusalRejectionAdditionalInfo = text;

    const serviceApplicationGranted = text;
    const serviceApplicationType = text;

    const servedByProcessServer = text;
    const servedByAlternativeMethod = text;
    const receivedAosFromResp = text;
    const successfulServedByBailiff = text;
    const reasonFailureToServe = text;

    return form({
      divorceWho,
      reasonForDivorce,
      state,
      marriageIsSameSexCouple,
      respAgreeToCosts,
      whoPaysCosts,
      respWillDefendDivorce,
      respStatementOfTruth,
      respAdmitOrConsentToFact,
      respJurisdictionAgree,
      reasonForDivorceBehaviourDetails,
      reasonForDivorceDesertionDetails,
      claimsCosts,
      permittedDecreeNisiReason,
      respConsiderFinancialSituation,
      respHardshipDefenseResponse,
      respLegalProceedingsExist,
      respHardshipDescription,
      respJurisdictionDisagreeReason,
      respJurisdictionRespCountryOfResidence,
      respLegalProceedingsDescription,
      respCostsReason,
      reasonForDivorceAdulteryDetails,
      refusalClarificationReason,
      refusalClarificationAdditionalInfo,
      refusalRejectionReason,
      refusalRejectionAdditionalInfo,
      serviceApplicationGranted,
      serviceApplicationType,
      servedByProcessServer,
      servedByAlternativeMethod,
      receivedAosFromResp,
      successfulServedByBailiff,
      reasonFailureToServe
    });
  }

  get sessionJson() {
    const blackList = ['cookie', 'temp'];

    const session = Object.keys(this.req.session)
      .filter(key => {
        return !blackList.includes(key);
      })
      .reduce((newSession, key) => {
        newSession[key] = this.req.session[key];
        return newSession;
      }, {});

    return JSON.stringify(session);
  }

  updateSession(req) {
    if (req.body.session) {
      Object.assign(req.session, JSON.parse(req.body.session));
    } else {
      Object.keys(req.body).forEach(key => {
        // state is the only value that us nested under case
        if (key === 'state') {
          req.session.case[key] = req.body[key];
        } else {
          req.session.case.data[key] = req.body[key];
        }
      });
    }
  }
}

module.exports = ModifySession;
