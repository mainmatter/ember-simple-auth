import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2', data).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
