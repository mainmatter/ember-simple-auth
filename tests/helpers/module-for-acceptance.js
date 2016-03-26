import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        // jscs:disable requireSpread
        options.beforeEach.apply(this, arguments);
        // jscs:enable requireSpread
      }
    },

    afterEach() {
      if (options.afterEach) {
        // jscs:disable requireSpread
        options.afterEach.apply(this, arguments);
        // jscs:enable requireSpread
      }

      destroyApp(this.application);
    }
  });
}
