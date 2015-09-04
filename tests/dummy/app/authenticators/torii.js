import Ember from 'ember';
import Torii from 'ember-simple-auth/authenticators/torii';

const { inject } = Ember;

export default Torii.extend({
  torii: inject.service('torii')
});
