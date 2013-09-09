/*globals EmberDev ENV QUnit */

(function() {
  window.Ember = window.Ember || {};

  Ember.config = {};
  Ember.testing = true;

  window.ENV = { TESTING: true };

  var extendPrototypes = QUnit.urlParams.extendprototypes;
  ENV['EXTEND_PROTOTYPES'] = !!extendPrototypes;

  if (EmberDev.jsHint) {
    // jsHint makes its own Object.create stub, we don't want to use this
    ENV['STUB_OBJECT_CREATE'] = !Object.create;
  }

  EmberDev.distros = {
    spade: 'ember-spade.js'
  };

})();
