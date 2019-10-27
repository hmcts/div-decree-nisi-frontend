const defined = input => {
  if (input !== null && typeof input === 'object') {
    return Object.values(input).some(el => {
      return Boolean(el);
    });
  }

  return Boolean(input);
};

module.exports.defined = defined;