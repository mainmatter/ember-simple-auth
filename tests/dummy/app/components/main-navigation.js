import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session:        service('session'),
  sessionAccount: service('session-account'),

  actions: {
    login() {
      this.sendAction('login');
    },

    logout() {
      this.get('session').invalidate();
    }
  }
});