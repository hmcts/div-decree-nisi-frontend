const sanitiseUrl = logMsg => {
  return logMsg.replace(/(.+)(__auth-token=.+)/mg, '\\$1');
};

module.exports = sanitiseUrl();
