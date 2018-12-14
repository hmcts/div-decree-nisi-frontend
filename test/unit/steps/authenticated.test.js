const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, expect } = require('@hmcts/one-per-page-test-suite');
const Entry = require('steps/entry/Entry.step');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage ]);
  });

  it('navigates to Entry step', () => {
    const stepInstance = new Authenticated({ journey: { steps: { Entry } } });
    expect(stepInstance.next().nextStep.path).to.eql(Entry.path);
  });
});
