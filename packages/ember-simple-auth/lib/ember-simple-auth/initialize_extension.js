import Configuration from './configuration';

/**
  Registers an extension initializer to be invoked when
  [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) is invoked. __This is used
  by extensions__ to the base Ember.SimpleAuth library that can e.g. register
  factories with the Ember.js dependency injection container here etc.

  @method initializeExtension
  @namespace $mainModule
  @static
  @param {Function} initializer The initializer to be invoked when [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) is invoked; this will receive the same arguments as [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).
*/
export default function(initializer) {
  Configuration.extensionInitializers.push(initializer);
}
