const authenticationUrl = '/authenticated?';
const authenticationParametersForRemoval = [
  'auth-token',
  'code'
];

const removeUrlParameters = (url, parametersForRemoval) => {
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const urlParameters = urlParts[1].split(/[&]/g);
    parametersForRemoval.forEach(parameterForRemoval => {
      urlParameters.forEach(urlParameter => {
        if (urlParameter.includes(`${parameterForRemoval}=`)) {
          urlParameters.splice(urlParameter, 1);
        }
      });
    });
    return urlParts[0] + (urlParameters.length > 0 ? `?${urlParameters.join('&')}` : '');
  }
  return url;
};

const sanitiseUrl = url => {
  return (url && url.includes(authenticationUrl)) ? removeUrlParameters(url, authenticationParametersForRemoval) : url;
};

module.exports = {
  removeUrlParameters,
  sanitiseUrl
};
