import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  engines: Object.freeze({
    myEngine: {
      dependencies: {
        externalRoutes: {
          login: 'login',
          index: 'index'
        },
        services: [
          'session'
        ]
      }
    }
  })
});

loadInitializers(App, config.modulePrefix);

export default App;
