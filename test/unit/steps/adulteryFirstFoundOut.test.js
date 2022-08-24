const modulePath = 'steps/adultery-first-found-out/AdulteryFirstFoundOut.step'; // eslint-disable-line

const AdulteryFirstFoundOut = require(modulePath);
const AdulteryFirstFoundOutContent = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.content');  // eslint-disable-line
const LivedApartSinceLastIncidentDate = require('steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'); // eslint-disable-line
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
    const session = { case: { data: {} } };
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'clarificationCourtFeedback',
      'signIn',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];
    return content(AdulteryFirstFoundOut, session, { ignoreContent });
  });

  it('shows error if no date entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = { 'adulteryFirstFoundDate.day': '' };
    const session = {
      case: {
        data: {
          marriageDate: '2001-10-02T00:00:00.000Z',
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(AdulteryFirstFoundOut, session, fields, { onlyErrors });
  });

  it('shows error if a date before marriage date is entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = {
      'adulteryFirstFoundDate.day': '20',
      'adulteryFirstFoundDate.month': '03',
      'adulteryFirstFoundDate.year': '1900'
    };
    const session = {
      case: {
        data: {
          marriageDate: '2001-10-02T00:00:00.000Z',
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(AdulteryFirstFoundOut, session, fields, { onlyErrors });
  });

  it('shows error if a date in future is entered', () => {
    const onlyErrors = ['requireFirstFoundDate'];
    const fields = {
      'adulteryFirstFoundDate.day': '20',
      'adulteryFirstFoundDate.month': '03',
      'adulteryFirstFoundDate.year': '2200'
    };
    const session = {
      case: {
        data: {
          marriageDate: '2001-10-02T00:00:00.000Z',
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.testErrors(AdulteryFirstFoundOut, session, fields, { onlyErrors });
  });

  it('Redirects to Adulter page if valid date entered', () => {
    const fields = {
      'adulteryFirstFoundDate.day': '20',
      'adulteryFirstFoundDate.month': '03',
      'adulteryFirstFoundDate.year': '2017'
    };
    const session = {
      case: {
        data: {
          marriageDate: '2001-10-02T00:00:00.000Z',
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    return question.redirectWithField(AdulteryFirstFoundOut, fields, LivedApartSinceLastIncidentDate, session); // eslint-disable-line
  });

  it('Returns correct answers', () => {
    const stepData = {
      adulteryFirstFoundDate: {
        day: '20',
        month: '03',
        year: '2017'
      }
    };
    const session = {
      case: {
        data: {
          marriageDate: '2001-10-02T00:00:00.000Z',
          createdDate: '2018-08-02T00:00:00.000Z'
        }
      }
    };
    const expectedContent = [
      // eslint-disable-next-line max-len
      AdulteryFirstFoundOutContent.en.fields.adulteryFirstFoundDate.question,
      '20th March 2017'
    ];

    return question.answers(AdulteryFirstFoundOut, stepData, expectedContent, session); // eslint-disable-line
  });
});
