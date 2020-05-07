import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  actions: {
    transitionToLoginRoute() {
      this.transitionToRoute('login');
    }
  }
});
