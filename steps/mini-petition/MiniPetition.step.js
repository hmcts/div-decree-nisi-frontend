const { Question } = require('@hmcts/one-per-page/steps');
const { branch, redirectTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const idam = require('services/idam');
const Joi = require('joi');

const { form, text, errorFor, object } = require('@hmcts/one-per-page/forms');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

class MiniPetition extends Question {
  static get path() {
    return config.paths.miniPetition;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const validateStatementOfTruthNoChanges = ({ hasBeenChanges = '', statementOfTruthNoChanges = '' }) => {
      // only validate if user has answered hasBeenChanges
      const hasntAnsweredChanges = !hasBeenChanges.length;
      if (hasntAnsweredChanges) {
        return true;
      }
      const hasAnsweredYesChanges = hasBeenChanges === 'yes';
      const hasAnsweredNoChanges = hasBeenChanges === 'no';
      const hasAnsweredStatementOfTruth = statementOfTruthNoChanges === 'yes';
      return hasAnsweredYesChanges || (hasAnsweredNoChanges && hasAnsweredStatementOfTruth);
    };

    const validateStatementOfTruthChanges = ({ hasBeenChanges = '', statementOfTruthChanges = '' }) => {
      // only validate if user has answered hasBeenChanges
      const hasntAnsweredChanges = !hasBeenChanges.length;
      if (hasntAnsweredChanges) {
        return true;
      }
      const hasAnsweredYesChanges = hasBeenChanges === 'yes';
      const hasAnsweredNoChanges = hasBeenChanges === 'no';
      const hasAnsweredStatementOfTruth = statementOfTruthChanges === 'yes';
      return hasAnsweredNoChanges || (hasAnsweredYesChanges && hasAnsweredStatementOfTruth);
    };

    const validateChangeDetails = ({ hasBeenChanges = '', changesDetails = '' }) => {
      // only validate if user has answered hasBeenChanges
      const hasntAnsweredChanges = !hasBeenChanges.length;
      if (hasntAnsweredChanges) {
        return true;
      }
      const hasAnsweredYesChanges = hasBeenChanges === 'yes';
      const hasAnsweredNoChanges = hasBeenChanges === 'no';
      const hasGivenDetails = changesDetails.length > 0;
      return hasAnsweredNoChanges || (hasAnsweredYesChanges && hasGivenDetails);
    };

    const fields = {
      hasBeenChanges: text.joi(this.content.errors.requireChanges, Joi.string()
        .valid(['yes', 'no'])
        .required()),
      statementOfTruthNoChanges: text,
      changesDetails: text,
      statementOfTruthChanges: text
    };

    const changes = object(fields)
      .check(
        errorFor('statementOfTruthNoChanges', this.content.errors.requireStatmentOfTruth),
        validateStatementOfTruthNoChanges
      )
      .check(
        errorFor('statementOfTruthChanges', this.content.errors.requireStatmentOfTruth),
        validateStatementOfTruthChanges
      )
      .check(
        errorFor('changesDetails', this.content.errors.requireChangeDetails),
        validateChangeDetails
      );

    return form({ changes });
  }

  answers() {
    const answers = [];

    answers.push(answer(this, {
      question: this.content.fields.changes.hasBeenChanges.title,
      answer: this.content.fields
        .changes.hasBeenChanges[this.fields.changes.hasBeenChanges.value]
    }));

    if (this.fields.changes.hasBeenChanges.value === 'yes') {
      answers.push(answer(this, {
        question: this.content.fields.changes.changesDetails.title,
        answer: this.fields.changes.changesDetails.value
      }));
    }

    return answers;
  }

  values() {
    const hasBeenChanges = this.fields.changes.hasBeenChanges.value;
    if (hasBeenChanges === 'yes') {
      return {
        'changes.hasBeenChanges': hasBeenChanges,
        'changes.changesDetails': this.fields.changes.changesDetails.value,
        'changes.statementOfTruthChanges': this.fields.changes.statementOfTruthChanges.value
      };
    } else if (hasBeenChanges === 'no') {
      return {
        'changes.hasBeenChanges': hasBeenChanges,
        'changes.statementOfTruthNoChanges': this.fields.changes.statementOfTruthNoChanges.value
      };
    }
    return {};
  }

  next() {
    const reasonForDivorce = this.case.reasonForDivorce.toLowerCase();
    return branch(
      redirectTo(this.journey.steps.Intolerable)
        .if(reasonForDivorce === 'adultery'),
      redirectTo(this.journey.steps.BehaviourContinuedSinceApplication)
        .if(reasonForDivorce === 'unreasonable-behaviour'),
      redirectTo(this.journey.steps.LivedApartSinceDesertion)
        .if(reasonForDivorce === 'desertion'),
      redirectTo(this.journey.steps.LivedApartSinceSeparation)
    );
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee')
    ];
  }
}

module.exports = MiniPetition;
