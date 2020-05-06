import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    transitionToLoginRoute() {
      this.transitionToRoute('login');
    }
  }
});
