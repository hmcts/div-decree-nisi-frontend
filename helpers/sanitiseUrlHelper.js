const parametersForRemoval = [
  'auth-token',
  'code'
];

// const sanitiseUrl = url => {
//   return url.replace(/(.+)(__auth-token=.+)/mg, '\\$1');
// };

const removeURLParameter = (url, parameter) => {
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const prefix = `${parameter}=`;
    const parameters = urlParts[1].split(/[&]/g);
    for (let i = parameters.length; i > 0; i--) {
      if (parameters[i].includes(prefix)) {
        parameters.splice(i, 1);
      }
    }
    return urlParts[0] + (parameters.length > 0 ? `?${parameters.join('&')}` : '');
  }
  return url;
};

const sanitiseUrl = url => {
  let resultUrl = url;
  if (resultUrl.includes('/authenticated?')) {
    for (const parameter of parametersForRemoval) {
      if (resultUrl.includes(parameter)) resultUrl = removeURLParameter(resultUrl, parameter);
    }
  }
  return resultUrl;
};

module.exports = {
  removeURLParameter,
  sanitiseUrl
};
