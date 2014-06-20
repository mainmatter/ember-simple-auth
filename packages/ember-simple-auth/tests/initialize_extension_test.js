import initializeExtension from 'ember-simple-auth/initialize_extension';
import Configuration from 'ember-simple-auth/configuration';

describe('initializeExtension', function() {

  it('adds the initializer to the list of extension initializers', function() {
    var initializer = function() {};
    initializeExtension(initializer);

    expect(Configuration.extensionInitializers).to.include(initializer);
  });

});
