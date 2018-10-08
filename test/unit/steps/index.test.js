const modulePath = 'steps/index';

const glob = require('glob');
const allSteps = require(modulePath);
const { expect } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const fileNameRegex = /^.*[\\\/]/g; // eslint-disable-line
const currentEnvironment = config.environment;

const findStepNames = location => {
  const files = [];
  glob.sync(location).forEach(file => {
    const stepName = file.replace(fileNameRegex, '').split('.')[0];
    files.push(stepName.toLowerCase());
  });
  return files;
};

describe(modulePath, () => {
  it('finds all steps in the steps folder', () => {
    const steps = allSteps();

    const fileNames = findStepNames('steps/**/*.step.js');
    const stepNames = steps.map(step => {
      return step.name.toLowerCase();
    });
    fileNames.forEach(fileName => {
      expect(stepNames.includes(fileName)).to.eql(true);
    });
  });

  it('finds all steps in the mock steps folder', () => {
    const steps = allSteps();

    const fileNames = findStepNames('mocks/steps/**/*.step.js');
    const stepNames = steps.map(step => {
      return step.name.toLowerCase();
    });
    fileNames.forEach(fileName => {
      expect(stepNames.includes(fileName)).to.eql(true);
    });
  });

  it('doest not include mocks if env is not developement', () => {
    config.environment = 'another env';
    const steps = allSteps();

    const fileNames = findStepNames('mocks/steps/**/*.step.js');
    const stepNames = steps.map(step => {
      return step.name;
    });
    fileNames.forEach(fileName => {
      expect(!stepNames.includes(fileName)).to.eql(true);
    });
    config.environment = currentEnvironment;
  });

  describe('#step.stepEnabled', () => {
    afterEach(() => {
      config.environment = currentEnvironment;
    });

    it('is false so should not add step', () => {
      config.environment = 'development';
      const steps = allSteps();

      const stepNames = steps.map(step => {
        return step.name;
      });

      expect(stepNames.includes('ModifySession')).to.eql(true);
    });

    it('is true so should add step', () => {
      config.environment = 'prod';
      const steps = allSteps();

      const stepNames = steps.map(step => {
        return step.name;
      });

      expect(stepNames.includes('ModifySession')).to.eql(false);
    });
  });
});
