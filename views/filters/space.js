const space = input => {
  if (!input || (typeof input !== 'number' && typeof input !== 'string')) {
    return input;
  }
  return `${input}`.match(/.{1,4}/g).join('&#32;');
};

module.exports.space = space;
