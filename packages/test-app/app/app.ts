import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import '@warp-drive/ember/install';

// @ts-expect-error the warp-drive types appear to be incorrect for this package
import { setBuildURLConfig } from '@ember-data/request-utils';

setBuildURLConfig({
  host: config.apiHost,
});

class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  engines = Object.freeze({
    'my-engine': {
      dependencies: {
        externalRoutes: {
          login: 'login',
          index: 'index',
        },
        services: ['session'],
      },
    },
  });
}

loadInitializers(App, config.modulePrefix);

export default App;
