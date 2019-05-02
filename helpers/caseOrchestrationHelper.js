const sessionToCosMapping = require('resources/sessionToCosMapping');
const { get } = require('lodash');
const config = require('config');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const { NOT_FOUND, MULTIPLE_CHOICES } = require('http-status-codes');
const idamService = require('services/idam');

const REDIRECT_TO_PETITIONER_FE = Symbol('redirect_to_pfe');
const redirectToPetitionerError = new Error('No valid state or no court included');
redirectToPetitionerError.statusCode = REDIRECT_TO_PETITIONER_FE;

const REDIRECT_TO_RESPONDENT_FE = Symbol('redirect_to_rfe');
const redirectToRespondentError = new Error('User is a respondent');
redirectToRespondentError.statusCode = REDIRECT_TO_RESPONDENT_FE;

const formatSessionForSubmit = req => {
  const { journey } = req;
  const sessionFieldPaths = Object.keys(sessionToCosMapping);

  const createRequestBody = (requestBody, sessionFieldPath) => {
    const sessionFieldPathAsArray = sessionFieldPath.split('.');

    // first item in array is the step class name
    const stepName = sessionFieldPathAsArray.shift();
    // rest of the items in array is path to field
    const fieldPath = sessionFieldPathAsArray.join('.');

    // get step that corresponds to the value in session
    const step = journey.instance(journey.steps[stepName]);

    // if step has been answered
    if (step && step.fields) {
      // retrieve all values as json for step
      const values = step.retrieve().values();
      // retrieve the field we need
      const value = get(values, fieldPath);

      // set a new key value pair based on mapping
      const ccdKey = sessionToCosMapping[sessionFieldPath];

      // only map the value that has been answered
      if (value) {
        requestBody[ccdKey] = value;
      } else {
        requestBody[ccdKey] = null;
      }
    }

    return requestBody;
  };

  return sessionFieldPaths.reduce(createRequestBody, {});
};

const validateResponse = (req, response) => {
  const { idam } = req;

  const notValidState = !response.state || config.ccd.d8States.includes(response.state);
  const noDigitalCourt = !config.ccd.courts.includes(response.data.courts);

  const userIsRespondent = idam.userDetails.email === response.data.respEmailAddress; // eslint-disable-line max-len

  switch (true) {
  case notValidState:
  case noDigitalCourt:
    return Promise.reject(redirectToPetitionerError);
  case userIsRespondent:
    return Promise.reject(redirectToRespondentError);
  default:
    return Promise.resolve(response);
  }
};

const handleErrorCodes = (error, req, res, next) => {
  switch (error.statusCode) {
  case NOT_FOUND:
  case REDIRECT_TO_PETITIONER_FE:
    redirectToFrontendHelper.redirectToFrontend(req, res);
    break;
  case MULTIPLE_CHOICES:
    res.redirect(config.paths.contactDivorceTeamError);
    break;
  case REDIRECT_TO_RESPONDENT_FE:
    idamService.logout()(req, res, () => {
      redirectToFrontendHelper.redirectToAos(req, res);
    });
    break;
  default:
    next(error);
  }
};

module.exports = {
  formatSessionForSubmit,
  validateResponse,
  handleErrorCodes,
  redirectToPetitionerError,
  redirectToRespondentError
};
