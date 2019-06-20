const logger = require('services/logger').getLogger(__filename);
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
  'aosoverdue',
  'aoscompleted',
  'awaitingdecreeabsolute'
];

const caseStateIsValid = currentState => {
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