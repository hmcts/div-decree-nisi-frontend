const authenticationParametersForRemoval = [
  'auth-token',
  'code'
];

const removeURLParameter = (url, parameter) => {
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const prefix = `${parameter}=`;
    const parameters = urlParts[1].split(/[&]/g);
    parameters.forEach(param => {
      if (param.includes(prefix)) {
        parameters.splice(param, 1);
      }
    });
    return urlParts[0] + (parameters.length > 0 ? `?${parameters.join('&')}` : '');
  }
  return url;
};

const sanitiseUrl = url => {
  let resultUrl = url;
  if (resultUrl.includes('/authenticated?')) {
    authenticationParametersForRemoval.forEach(parameter => {
      if (resultUrl.includes(parameter)) resultUrl = removeURLParameter(resultUrl, parameter);
    });
  }
  return resultUrl;
};

module.exports = {
  removeURLParameter,
  sanitiseUrl
};
