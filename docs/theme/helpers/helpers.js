module.exports = {
  exists: function(variable, options) {
    if (typeof variable !== 'undefined') {
      return options.fn(this);
    } else if (options.inverse) {
      return options.inverse(this);
    }
  }
};
