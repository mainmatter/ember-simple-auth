/* eslint-env node */
/* eslint-disable no-var, object-shorthand */

module.exports = {
  framework: 'mocha',
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        '--headless',
        '--window-size=1440,900',
        '--disable-gpu',
        '--remote-debugging-port=9222'
      ]
    }
  }
};
