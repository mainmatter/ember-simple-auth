'use strict';

module.exports = {
  printWidth: 120,
  singleQuote: true,
  overrides: [
    {
      files: '**/*.{hbs,md,yml,yaml}',
      options: {
        singleQuote: false,
      },
    },
  ],
};
