const { shimSessionQuestion } = require('middleware/shimSession');
const { form, text, list, object, errorFor } = require('@hmcts/one-per-page/forms');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const idam = require('services/idam');
const evidenceManagmentMiddleware = require('middleware/evidenceManagmentMiddleware');
const errors = require('resources/errors');
const { parseBool } = require('@hmcts/one-per-page/util');
const { notDefined, awaitingClarification } = require('common/constants');
const checkWelshToggle = require('middleware/checkWelshToggle');

class Upload extends shimSessionQuestion {
  static get path() {
    return config.paths.upload;
  }

  get case() {
    return this.req.session.case.data;
  }

  get caseState() {
    return this.req.session.case.state ? this.req.session.case.state.toLowerCase() : notDefined;
  }

  get isAwaitingClarification() {
    const isDnOutcomeCase = parseBool(this.case.dnOutcomeCase);
    const featureIsEnabled = parseBool(config.features.awaitingClarification);
    const isCorrectState = this.caseState === awaitingClarification;

    return isDnOutcomeCase && featureIsEnabled && isCorrectState;
  }

  get form() {
    const fields = {
      fileName: text,
      fileUrl: text,
      error: text
    };

    const unkownError = ({ error = '' }) => {
      return error !== errors.unknown.code;
    };

    const virusError = ({ error = '' }) => {
      return error !== errors.virusFoundInFile.code;
    };

    const maxFilesError = ({ error = '' }) => {
      return error !== errors.maximumFilesExceeded.code;
    };

    const fileSizeError = ({ error = '' }) => {
      return error !== errors.fileSizeTooLarge.code;
    };

    const fileTypeError = ({ error = '' }) => {
      return error !== errors.fileTypeInvalid.code;
    };

    const file = object(fields)
      .check(
        errorFor('error', this.content.errors.errorUnknown),
        unkownError
      )
      .check(
        errorFor('error', this.content.errors.errorVirusFoundInFile),
        virusError
      )
      .check(
        errorFor('error', this.content.errors.errorMaximumFilesExceeded),
        maxFilesError
      )
      .check(
        errorFor('error', this.content.errors.errorFileSizeTooLarge),
        fileSizeError
      )
      .check(
        errorFor('error', this.content.errors.errorFileTypeInvalid),
        fileTypeError
      );
    const files = list(file);

    return form({ files });
  }

  answers() {
    const answers = [];

    if (this.fields.files.value.length) {
      const files = this.fields.files.value.map(file => {
        return file.fileName;
      });

      answers.push(answer(this, {
        question: this.content.fields.files.title,
        answer: files
      }));
    } else {
      answers.push(answer(this, {
        question: this.content.fields.files.title,
        answer: 'None'
      }));
    }

    return answers;
  }

  next() {
    return redirectTo(this.journey.steps.CheckYourAnswers);
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      evidenceManagmentMiddleware.createHandler(this.name),
      checkWelshToggle
    ];
  }

  get filesWithoutErrors() {
    return this.fields.files.value.filter(file => {
      return !file.error;
    });
  }

  handler(req, res, next) {
    if (req.method === 'POST') {
      this.retrieve();
      this.validate();

      if (this.valid) {
        this.store();
        this.next().redirect(req, res, next);
      } else {
        this.storeErrors();
        res.redirect(this.path);
      }
    } else {
      super.handler(req, res, next);
      delete req.session.temp;
    }
  }
}

module.exports = Upload;
