const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const { get } = require('lodash');

/* Any additional state checks happen here.
 * For example we only want to show AwaitingDecreeAbsolute page if
 * case has a decreeNisiGrantedDate.
 */
const additionalStateChecks = {
  awaitingdecreeabsolute: session => {
    return get(session, 'case.data.decreeNisiGrantedDate');
  }
};

const additionalStateCheck = (state, session) => {
  const check = additionalStateChecks[state];
  if (check) {
    return check(session);
  }

  return true;
};

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
  'awaitingdecreeabsolute',
  'dnpronounced'
];

const caseStateIsValid = currentState => {
  return validCaseStates.includes(currentState);
};

const checkCaseState = (req, res, next) => {
  const currentState = req.session.case.state ? req.session.case.state.toLowerCase() : null;

  if (caseStateIsValid(currentState) && additionalStateCheck(currentState, req.session)) {
    next();
  } else {
    logger.errorWithReq(req, 'error_checking_valid_state',
      `The current case state ${currentState} is not handled by the petitioner progress bar`
    );
    res.redirect(config.paths.contactDivorceTeam);
  }
};

module.exports = checkCaseState;