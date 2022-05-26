const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  case: {
    state: 'AOSstarted',
    data: {
      caseReference: 'LV17D80101'
    }
  }
};

describe('Test contact us for help', () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.getFee.restore();
  });

  it('shows email and phone content', () => {
    const specificContent = [
      'phoneTitle',
      'phoneToCallIfProblems',
      'emailTitle',
      'emailIfProblems',
      'responseTime'
    ];
    return content(PetitionProgressBar, session, { specificContent });
  });
});
