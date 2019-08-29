const modulePath = 'steps/upload/Upload.step';

const Upload = require(modulePath);
const UploadContent = require('steps/upload/Upload.content');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const evidenceManagmentMiddleware = require('middleware/evidenceManagmentMiddleware');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(evidenceManagmentMiddleware, 'createHandler').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    evidenceManagmentMiddleware.createHandler.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Upload, [
      idam.protect(),
      evidenceManagmentMiddleware.createHandler()
    ]);
  });

  it('redirects to CheckYourAnswers', () => {
    return question.redirectWithField(Upload, {}, CheckYourAnswers);
  });

  describe('content', () => {
    it('renders the content', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'noFiles',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours'
      ];
      const session = { case: { data: {} } };
      return content(Upload, session, { ignoreContent });
    });

    it('only renders files without errors to page', () => {
      const session = {
        Upload: {
          files: [
            {
              fileName: 'good file',
              fileUrl: 'file url'
            },
            {
              fileName: 'bad file',
              fileUrl: 'bad file url',
              error: 'errorUnknown'
            }
          ]
        }
      };
      const specificValuesToNotExist = ['bad file'];
      const specificValues = ['good file'];
      const ignoreContent = [ 'noFiles' ];
      return content(Upload, session, {
        specificValuesToNotExist,
        ignoreContent,
        specificValues
      });
    });
  });

  describe('errors', () => {
    it('shows unkown error if unkown error thrown', () => {
      const session = {
        Upload: {
          files: [{ error: 'errorUnknown' }]
        }
      };
      const onlyErrors = ['errorUnknown'];
      return question.testErrors(Upload, session, {}, { onlyErrors });
    });

    it('shows file size error if file size error thrown', () => {
      const session = {
        Upload: {
          files: [{ error: 'errorFileSizeTooLarge' }]
        }
      };
      const onlyErrors = ['errorFileSizeTooLarge'];
      return question.testErrors(Upload, session, {}, { onlyErrors });
    });

    it('shows file type error if file type error thrown', () => {
      const session = {
        Upload: {
          files: [{ error: 'errorFileTypeInvalid' }]
        }
      };
      const onlyErrors = ['errorFileTypeInvalid'];
      return question.testErrors(Upload, session, {}, { onlyErrors });
    });

    it('shows max files error if max files error thrown', () => {
      const session = {
        Upload: {
          files: [{ error: 'errorMaximumFilesExceeded' }]
        }
      };
      const onlyErrors = ['errorMaximumFilesExceeded'];
      return question.testErrors(Upload, session, {}, { onlyErrors });
    });

    it('shows virus error if virus error thrown', () => {
      const session = {
        Upload: {
          files: [{ error: 'errorVirusFoundInFile' }]
        }
      };
      const onlyErrors = ['errorVirusFoundInFile'];
      return question.testErrors(Upload, session, {}, { onlyErrors });
    });
  });

  describe('values', () => {
    it('displays if uploaded files', () => {
      const session = {
        Upload: {
          files: [
            {
              fileName: 'good file',
              fileUrl: 'file url'
            }
          ]
        }
      };
      return content(
        Upload,
        session,
        {
          specificValues: [ session.Upload.files[0].fileName ]
        }
      );
    });
  });

  describe('answers', () => {
    it('shows uploaded files', () => {
      const stepData = {
        files: [
          {
            fileName: 'good file',
            fileUrl: 'file url'
          }
        ]
      };
      const expectedContent = [
        UploadContent.en.fields.files.title,
        stepData.files[0].fileName
      ];
      return question.answers(Upload, stepData, expectedContent);
    });
  });
});
