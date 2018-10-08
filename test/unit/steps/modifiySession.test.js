const modulePath = 'steps/modify-session/ModifySession.step';

const ModifySession = require(modulePath);
const { content, expect } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const ignoreContent = [
  'problemWithThisPage',
  'pleaseEmailOrCallDivorceCourt',
  'phoneToCallIfProblems',
  'emailIfProblems',
  'continue'
];
const previousEnvironment = config.environment;

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(ModifySession, {}, { ignoreContent });
  });

  it('step is not enabled on prod', () => {
    config.environment = 'prod';
    expect(ModifySession.stepEnabled).to.eql(false);

    config.environment = previousEnvironment;
  });

  it('step is enabled on anything but prod', () => {
    config.environment = 'anything but prod';
    expect(ModifySession.stepEnabled).to.eql(true);

    config.environment = previousEnvironment;
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
        .to.eql('{"foo":"bar","reasonForDivorce":"reasonForDivorce"}');
    });

    it('#retrieve returns correct fields populated', () => {
      const instance = modifySessionInstance.retrieve();
      expect(instance.fields.reasonForDivorce.value).to.eql('reasonForDivorce');
    });

    describe('#updateSession', () => {
      it('replaces case data if raw session sent', () => {
        const req = { body: { case: JSON.stringify({ bar: 'foo' }) }, session: { case: {} } };
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
