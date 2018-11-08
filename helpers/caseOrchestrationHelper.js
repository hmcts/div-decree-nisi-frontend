// A helper to convert answers in OPP format into a json body request
// that COS and CDD can understand

const sessionToCosMapping = require('resources/sessionToCosMapping');
const { get } = require('lodash');

const formatSessionForSubmit = req => {
  const { journey } = req;
  const sessionFieldPaths = Object.keys(sessionToCosMapping);

  const createRequestBody = (requestBody, sessionFieldPath) => {
    const sessionFieldPathAsArray = sessionFieldPath.split('.');

    // first item in array is the step class name
    const stepName = sessionFieldPathAsArray.shift();
    // rest of the items in array is path to field
    const fieldPath = sessionFieldPathAsArray.join('.');

    // get step that corrisponds to the value in session
    const step = journey.instance(journey.steps[stepName]);

    // if step has been answered
    if (step && step.fields) {
      // retreive all values as json for step
      const values = step.retrieve().values();
      // retrieve the field we need
      const value = get(values, fieldPath);

      // only map the value that has been answered
      if (value) {
        // set a new key value pair based on mapping
        const ccdKey = sessionToCosMapping[sessionFieldPath];
        requestBody[ccdKey] = value;
      }
    }

    return requestBody;
  };

  return sessionFieldPaths.reduce(createRequestBody, {});
};

module.exports = { formatSessionForSubmit };
