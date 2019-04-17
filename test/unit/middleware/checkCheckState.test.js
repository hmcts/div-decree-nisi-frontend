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
  'aoscompleted'
];

const invalidCaseState = [
  'iAmNotValid',
  'noreAmI'
];

describe(modulePath, () => {
  describe('passes if each state is handled by DN petitioner progress page', () => {
    validCaseStates.forEach(validState => {
      it(`case state: ${validState}`, () => {
        const req = { session: { case: { state: validState } } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();
        checkCaseState(req, res, next);
        expect(next.calledOnce).to.eql(true);
        expect(res.redirect.called).to.eql(false);
      });
    });
  });

  describe('redirects to contact us page if state is invalid', () => {
    invalidCaseState.forEach(invalidState => {
      it(`case state: ${invalidState}`, () => {
        const req = { session: { case: { state: invalidState } } };
        const res = { redirect: sinon.stub() };
        const next = sinon.stub();
        checkCaseState(req, res, next);
        expect(next.calledOnce).to.eql(false);
        expect(res.redirect.calledOnce).to.eql(true);
        expect(res.redirect.calledWith(config.paths.contactDivorceTeam)).to.eql(true);
      });
    });
  });
});