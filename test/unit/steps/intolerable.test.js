const modulePath = 'steps/intolerable/Intolerable.step';

const IntolerableContent = require('steps/intolerable/Intolerable.content');  // eslint-disable-line


const Intolerable = require(modulePath);

const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const ExitIntolerable = require('steps/exit-intolerable/ExitIntolerable.step');
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
    return middleware.hasMiddleware(Intolerable, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(Intolerable);
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(Intolerable, {}, {}, { onlyErrors });
  });

  it('redirects to adulteryFirstFoundOut if answered yes', () => {
    const fields = {
      intolerable: 'yes'
    };
    return question.redirectWithField(Intolerable, fields, AdulteryFirstFoundOut);
  });

  it('redirects to exitIntolerable if answered no', () => {
    const fields = {
      intolerable: 'no'
    };
    return question.redirectWithField(Intolerable, fields, ExitIntolerable);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      IntolerableContent.en.fields.changes.intolerable.title,
      IntolerableContent.en.fields.changes.intolerable.yes
    ];

    const stepData = {
      intolerable: 'yes'
    };

    return question.answers(Intolerable, stepData, expectedContent, {});
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      IntolerableContent.en.fields.changes.intolerable.title,
      IntolerableContent.en.fields.changes.intolerable.no
    ];

    const stepData = {
      intolerable: 'no'
    };

    return question.answers(Intolerable, stepData, expectedContent, {});
  });
});
