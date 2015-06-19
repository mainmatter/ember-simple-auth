import initializer from './initializer';
import instanceInitializer from './instance-initializer';

Ember.onLoad('Ember.Application', function(Application) {
  if (Application.instanceInitializer) {
    Application.instanceInitializer(instanceInitializer);
  } else {
    Application.initializer(initializer);
  }
});
