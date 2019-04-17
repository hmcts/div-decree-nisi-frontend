const logger = require('services/logger').getLogger(__filename);
const { parseBool } = require('@hmcts/one-per-page/util');
const config = require('config');

const validCaseStates = [
  'submitted',
  'awaitinghwfdecision',
  'awaitingdocuments',
  'awaitingdecreenisi',
  'pendingrejection',
  'petitioncompleted',
  'aosstarted',
  'aosawaiting',
  'issued',
  'awaitinglegaladvisorreferral',
  'awaitingconsideration',
  'awaitingpronouncement',
  'awaitingclarification',
  'defendeddivorce',
  'aossubmittedawaitinganswer',
  'aosoverdue'
];

const validCaseStates520 = [
  'submitted',
  'awaitinghwfdecision',
  'awaitingdocuments',
  'awaitingdecreenisi',
  'pendingrejection',
  'petitioncompleted',
  'aosstarted',
  'aosawaiting',
  'issued',
  'awaitinglegaladvisorreferral',
  'defendeddivorce',
  'aossubmittedawaitinganswer',
  'aosoverdue',
  'aoscompleted'
];

const caseStateIsValid = currentState => {
  if (parseBool(config.features.release520)) {
    return validCaseStates520.includes(currentState);
  }

  return validCaseStates.includes(currentState);
};

const checkCaseState = (req, res, next) => {
  const currentState = req.session.case.state ? req.session.case.state.toLowerCase() : null;

  if (caseStateIsValid(currentState)) {
    next();
  } else {
    logger.errorWithReq(req, 'error_checking_valid_state',
      `The current case state ${currentState} is not handled by the petitioner progress bar`
    );
    res.redirect(config.paths.contactDivorceTeam);
  }
};

module.exports = checkCaseState;