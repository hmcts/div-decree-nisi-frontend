const modulePath = 'steps/resp-not-admit-adultery/RespNotAdmitAdultery.step';

const RespNotAdmitAdultery = require(modulePath);
const RespNotAdmitAdulteryContent = require(
  'steps/resp-not-admit-adultery/RespNotAdmitAdultery.content'
);
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const AmendApplication = require('steps/amend-application/AmendApplication.step');
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

describe(modulePath, () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    sandbox.restore();
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(RespNotAdmitAdultery, [ idam.protect() ]);
  });

  describe('Respondent not admitted to Adultery', () => {
    it('renders the content', () => {
      const session = {
        case: {
          state: 'DNAwaiting',
          data: {
            reasonForDivorce: 'Adultery',
            respAdmitOrConsentToFact: 'Yes'
          }
        }
      };
      return content(RespNotAdmitAdultery, session);
    });

    it('returns correct answers', () => {
      const expectedContent = [ RespNotAdmitAdulteryContent.en.fields.amendPetition.yes ];
      const session = {
        case: {
          data: {
            reasonForDivorce: 'Adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const fields = { amendPetition: 'yes' };
      return question.answers(RespNotAdmitAdultery, fields, expectedContent, session);
    });

    it('redirects to ApplyForDecreeNisi page', () => {
      const fields = { amendPetition: 'no' };
      return question.redirectWithField(RespNotAdmitAdultery, fields, ApplyForDecreeNisi);
    });

    it('redirects to AmendPetition page', () => {
      sandbox.replace(config.features, 'release520', true);
      const fields = { amendPetition: 'yes' };
      return question.redirectWithField(RespNotAdmitAdultery, fields, AmendApplication);
    });
  });
});
