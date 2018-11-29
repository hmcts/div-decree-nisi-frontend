const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ContactDivorceTeam = require('steps/contact-divorce-team/ContactDivorceTeam.step');
const idam = require('services/idam');
const { middleware, redirect, sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { NOT_FOUND, INTERNAL_SERVER_ERROR, MULTIPLE_CHOICES } = require('http-status-codes');
const config = require('config');

describe(modulePath, () => {
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').callsFake(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
    });

    afterEach(() => {
      idam.authenticate.restore();
      caseOrchestrationService.getApplication.restore();
    });

    it('to PetitionProgressBar page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Entry, PetitionProgressBar, null);
    });

    it('to error page if error is not 404', () => {
      const error = new Error('An error has occoured on the Case Orchestartion Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.getApplication.rejects(error);
      return custom(Entry)
        .get()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          return expect(pageContent.indexOf(error) !== -1).to.eql(true);
        });
    });

    it('to contact divorce team page if error is 300', () => {
      const error = new Error('Multiple cases found on Case orchestration service');
      error.statusCode = MULTIPLE_CHOICES;
      caseOrchestrationService.getApplication.rejects(error);
      return redirect.navigatesToNext(Entry, ContactDivorceTeam);
    });

    it('to petitioner frontend  if error is 404', () => {
      const error = new Error('The case does not exist on CCD');
      error.statusCode = NOT_FOUND;
      caseOrchestrationService.getApplication.rejects(error);
      return custom(Entry)
        .get()
        .expect('location', config.services.petitionerFrontend.url);
    });
  });
});
