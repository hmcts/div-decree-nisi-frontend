const { expect } = require('chai');
const sinon = require('sinon');

const divAppRouter = require('@hmcts/div-app-router');

describe('appRouter', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('middleware/appRouter')];
    sinon.stub(divAppRouter, 'setup');
  });

  afterEach(() => {
    divAppRouter.setup.restore();
  });

  it('should call the setup method on intialisation', () => {
    require('middleware/appRouter'); // eslint-disable-line global-require

    expect(divAppRouter.setup.calledOnce).to.be.true;
  });
});