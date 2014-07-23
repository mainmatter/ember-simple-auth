import initializer from './initializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
});
