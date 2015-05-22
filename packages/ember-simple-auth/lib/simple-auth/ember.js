import initializer from './initializer';
import instainceInitializer from './instaince-initializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
  if(Application.instainceInitializer) {
    Application.instainceInitializer(instainceInitializer);
  }
});
