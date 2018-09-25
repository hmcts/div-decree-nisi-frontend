const modulePath = 'steps/adultery-first-found-out/AdulteryFirstFoundOut.step'; // eslint-disable-line

const AdulteryFirstFoundOut = require(modulePath);

const AdulteryFirstFoundOutContent = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.content');  // eslint-disable-line

const LivedApartSinceLastIncidentDate = require('steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'); // eslint-disable-line

const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');


describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(AdulteryFirstFoundOut, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(AdulteryFirstFoundOut);
  });

  it('shows error if no date entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = { 'changes-adulteryFirstFoundDate-day': '' };
    return question.testErrors(AdulteryFirstFoundOut, {}, fields, { onlyErrors });
  });

  it('shows error if a date before marriage date is entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = {
      'changes-adulteryFirstFoundDate-day': '20',
      'changes-adulteryFirstFoundDate-month': '03',
      'changes-adulteryFirstFoundDate-year': '1900'
    };
    return question.testErrors(AdulteryFirstFoundOut, {}, fields, { onlyErrors });
  });

  it('shows error if a date in future is entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = {
      'changes-adulteryFirstFoundDate-day': '20',
      'changes-adulteryFirstFoundDate-month': '03',
      'changes-adulteryFirstFoundDate-year': '2200'
    };
    return question.testErrors(AdulteryFirstFoundOut, {}, fields, { onlyErrors });
  });

  it('Redirects to Adulter page if valid date entered', () => {
    const fields = {
      'changes-adulteryFirstFoundDate-day': '20',
      'changes-adulteryFirstFoundDate-month': '03',
      'changes-adulteryFirstFoundDate-year': '2017'
    };
    return question.redirectWithField(AdulteryFirstFoundOut, fields, LivedApartSinceLastIncidentDate); // eslint-disable-line
  });
});
