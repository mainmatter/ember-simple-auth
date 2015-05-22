import initializer from './initializer';
import instanceInitializer from './instance-initializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
  if(Application.instainceInitializer) {
    Application.instanceInitializer(instanceInitializer);
  }
});
