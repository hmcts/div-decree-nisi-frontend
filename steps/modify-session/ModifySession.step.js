const { Question } = require('@hmcts/one-per-page');
const config = require('config');
const { form, text } = require('@hmcts/one-per-page/forms');
const path = require('path');
const express = require('express');

class ModifySession extends Question {
  static get stepEnabled() {
    return config.environment !== 'prod';
  }

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
    return config.paths.modifySession;
  }

  get form() {
    const reasonForDivorce = text;
    const state = text;
    const marriageIsSameSexCouple = text;
    const divorceWho = text;

    const respAgreeToCosts = text;
    const respDefendsDivorce = text;
    const respStatementOfTruth = text;
    const respAdmitOrConsentToFact = text;
    const respJurisdictionAgree = text;

    return form({
      divorceWho,
      reasonForDivorce,
      state,
      marriageIsSameSexCouple,
      respAgreeToCosts,
      respDefendsDivorce,
      respStatementOfTruth,
      respAdmitOrConsentToFact,
      respJurisdictionAgree
    });
  }

  get sessionJson() {
    return JSON.stringify(this.req.session.case);
  }

  updateSession(req) {
    if (req.body.case) {
      Object.assign(req.session, { case: JSON.parse(req.body.case) });
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
