import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  session: service('session'),

  model() {
    this.get('session').authenticate('authenticator:auth');
  }
});
