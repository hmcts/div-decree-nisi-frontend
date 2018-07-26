const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const Start = require('steps/start/Start.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'authenticate').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.authenticate.restore();
  });

  it('to protected page', () => {
    return redirect.navigatesToNext(Entry, Start);
  });
});
