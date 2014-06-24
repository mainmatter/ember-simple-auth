var global = (typeof window !== 'undefined') ? window : {},
    Ember = global.Ember;

import initializer from './initializer';

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(initializer);
});
