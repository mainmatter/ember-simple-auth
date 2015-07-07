import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  mySession: service('custom-session'),

  actions: {
    login() {
      this.sendAction('login');
    },

    logout() {
      this.get('mySession').invalidate();
    }
  }
});