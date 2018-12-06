const modulePath = 'mocks/steps/modify-session/ModifySession.step';

const ModifySession = require(modulePath);
const { content, expect } = require('@hmcts/one-per-page-test-suite');

const ignoreContent = [
  'problemWithThisPage',
  'pleaseEmailOrCallDivorceCourt',
  'phoneToCallIfProblems',
  'emailIfProblems',
  'continue'
];

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(ModifySession, {}, { ignoreContent });
  });

  describe('Instance tests', () => {
    let modifySessionInstance = {};

    beforeEach(() => {
      const req = {
        journey: {},
        session: {
          case: {
            foo: 'bar',
            reasonForDivorce: 'reasonForDivorce'
          }
        }
      };
      modifySessionInstance = new ModifySession(req, {});
    });

    it('#sessionJson returns json object of case', () => {
      expect(modifySessionInstance.sessionJson)
        .to.eql('{"case":{"foo":"bar","reasonForDivorce":"reasonForDivorce"}}');
    });

    it('#retrieve returns correct fields populated', () => {
      const instance = modifySessionInstance.retrieve();
      expect(instance.fields.reasonForDivorce.value).to.eql('reasonForDivorce');
    });

    describe('#updateSession', () => {
      it('replaces case data if raw session sent', () => {
        const req = {
          body: {
            session: JSON.stringify({ case: { bar: 'foo' } })
          },
          session: { case: {} }
        };
        modifySessionInstance.updateSession(req);
        expect(req.session.case).to.eql({ bar: 'foo' });
      });

      it('if no case data replaces key by key', () => {
        const req = { body: { bar: 'foo' }, session: { case: { data: {} } } };
        modifySessionInstance.updateSession(req);
        expect(req.session.case.data).to.eql({ bar: 'foo' });
      });
    });
  });
});
