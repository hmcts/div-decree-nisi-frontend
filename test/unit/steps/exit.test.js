const modulePath = 'steps/exit/Exit.step';

const Exit = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const preserveSession = require('middleware/preserveSession');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has preserveSession middleware', () => {
    return middleware.hasMiddleware(Exit, [ preserveSession ]);
  });

  describe('values', () => {
    it('displays divorce center details', () => {
      const session = {
        divorceCenterEmail: 'thisistheemail@email.com',
        divorceCenterPhone: '0123456789'
      };
      return content(
        Exit,
        session,
        {
          specificValues: [
            session.divorceCenterEmail,
            session.divorceCenterPhone
          ]
        }
      );
    });
  });
});
