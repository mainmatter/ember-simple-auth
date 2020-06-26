const najax = require('najax');

module.exports = {
  buildSandboxGlobals(defaultGlobals) {
    return Object.assign({}, defaultGlobals, {
      najax
    });
  }
};
