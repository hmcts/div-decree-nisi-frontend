const modulePath = 'middleware/checkCaseState';

const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const checkCaseState = require(modulePath);
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
  'defendeddivorce',
  'aossubmittedawaitinganswer',
  'aosoverdue',
  'aoscompleted',
  'awaitingdecreeabsolute',
  'dnpronounced'
];

const invalidCaseState = [
  'iAmNotValid',
  'noreAmI'
];

const statesNotHandled = [
  'awaitinggeneralreferralpayment',
  'generalconsiderationcomplete',
  'awaitingdecreeabsolute'
];

describe(modulePath, () => {
  describe('passes if each state is handled by DN petitioner progress page', () => {
    validCaseStates.forEach(validState => {
      it(`case state: ${validState}`, () => {
        const req = { session: { case: {
          state: validState,
          data: { decreeNisiGrantedDate: '2222-01-01T00:00:00.000+0000' }
        } } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();
        checkCaseState(req, res, next);
        expect(next.calledOnce).to.eql(true);
        expect(res.redirect.called).to.eql(false);
      });
    });
  });

  describe('Contact Divorce team redirection test', () => {
    let next = null;
    let req = null;
    let res = null;
    const { contactDivorceTeam } = config.paths;

    beforeEach(() => {
      res = { redirect: sinon.stub() };
      next = sinon.stub();
    });

    const statesNotHandledOrInvalid = [].concat(invalidCaseState, statesNotHandled);
    statesNotHandledOrInvalid.forEach(caseState => {
      it(`should redirect to contact us page if state is: ${caseState}`, () => {
        req = { session: { case: { state: caseState } } };
        checkCaseState(req, res, next);

        expect(next.calledOnce).to.eql(false);
        expect(res.redirect.calledOnce).to.eql(true);
        expect(res.redirect.calledWith(contactDivorceTeam)).to.eql(true);
      });
    });
  });
});
