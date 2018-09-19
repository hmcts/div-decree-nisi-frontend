const modulePath = 'steps/check-your-answers/CheckYourAnswers.step';

const CheckYourAnswers = require(modulePath);
const Done = require('steps/done/Done.step');
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
    return middleware.hasMiddleware(CheckYourAnswers, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'applyingForDecreeNisi',
      'applyingForDecreeNisiClaimsCostsRespondent',
      'applyingForDecreeNisiClaimsCostsCoRespondent',
      'applyingForDecreeNisiClaimsCostsRespondentCoRespondent',
      'continue'
    ];
    return content(CheckYourAnswers, {}, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(CheckYourAnswers);
  });

  it('redirects to Done if statment of true answered', () => {
    const fields = { statementOfTruth: 'yes' };
    return question.redirectWithField(CheckYourAnswers, fields, Done);
  });

  describe('claims costs statment of truth', () => {
    it('from respondent and correspondent', () => {
      const session = {
        originalPetition: {
          claimsCosts: 'Yes',
          divorceClaimFrom: ['respondent', 'correspondent']
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsRespondentCoRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('from respondent', () => {
      const session = {
        originalPetition: {
          claimsCosts: 'Yes',
          divorceClaimFrom: ['respondent']
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('from correspondent', () => {
      const session = {
        originalPetition: {
          claimsCosts: 'Yes',
          divorceClaimFrom: ['correspondent']
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsCoRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('no claim costs', () => {
      const session = { originalPetition: { claimsCosts: 'No' } };
      const specificContent = ['applyingForDecreeNisi'];
      return content(CheckYourAnswers, session, { specificContent });
    });
  });
});
