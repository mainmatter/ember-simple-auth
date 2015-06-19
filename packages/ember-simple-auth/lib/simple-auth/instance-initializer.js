import Configuration from './configuration';
import getGlobalConfig from './utils/get-global-config';
import setup from './setup';

export default {
  name:       'simple-auth',
  initialize: function(instance) {
    var config = getGlobalConfig('simple-auth');
    var container = instance.container;
    var appRoute = container.lookup('route:application');

    appRoute.reopen({
      beforeModel: function(transition) {
        var _this = this;
        Configuration.load(container, config);
        return setup(container, container.lookup('application:main'), true).then(function() {
          return _this._super(transition);
        });
      }
    });
  }
};
