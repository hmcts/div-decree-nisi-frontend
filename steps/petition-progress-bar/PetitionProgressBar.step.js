/* eslint-disable complexity */
const { Interstitial } = require('@hmcts/one-per-page/steps');
const config = require('config');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');

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

  get ccdState() {
    return this.req.session.case.state ? this.req.session.case.state : 'notDefined';
  }

  next() {
    const showReviewAosResponse = this.respDefendsDivorce && ['yes', 'no'].includes(this.respDefendsDivorce.toLowerCase()); // eslint-disable-line

    return branch(
      redirectTo(this.journey.steps.ReviewAosResponse)
        .if(showReviewAosResponse),
      redirectTo(this.journey.steps.ApplyForDecreeNisi)
    );
  }

  get ccdStatus() {
    const ccdStatus = this.ccdState.toLowerCase();
    const DNReason = this.case.permittedDecreeNisiReason;
    const submittedFlow = [
      'submitted', 'awaitinghwfdecision',
      'awaitingdocuments', 'issued', 'pendingrejection', 'petitioncompleted'
    ];
    const issuedFlow = ['aosawaiting', 'aosstarted'];
    const awaitFlow = ['awaitinglegaladvisorreferral', 'awaitingconsiderationdn'];
    const defendedAwaitingAnswer = ['aossubmittedawaitinganswer'];
    const awaitingdecreenisi = ['dnawaiting'];
    const respondentNotReplied = ['aosoverdue'];

    if (submittedFlow.includes(ccdStatus)) {
      return 'submitted';
    } else if (issuedFlow.includes(ccdStatus)) {
      return 'issued';
    } else if (awaitFlow.includes(ccdStatus)) {
      return 'awaiting';
    } else if (defendedAwaitingAnswer.includes(ccdStatus)) {
      return 'defendedAwaitingAnswer';
    } else if (respondentNotReplied.includes(ccdStatus)) {
      return 'respondentNotReplied';
    } else if (awaitingdecreenisi.includes(ccdStatus)) {
      switch (DNReason) {
      case '0':
        return 'undefended';
      case '1':
        return 'deemedService';
      case '2':
        return 'dispensedWithService';
      case '3':
        return 'defendedWithoutAnswer';
      case '4':
        return 'defendedWithoutAnswer';
      default:
        return 'undefended';
      }
    }
    return 'undefended';
  }
}

module.exports = PetitionProgressBar;
