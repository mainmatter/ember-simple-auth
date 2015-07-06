import Ember from 'ember';

export default Ember.Controller.extend({
  sessionService: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('sessionService').authenticate('authenticator:oauth2-password-grant', data).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
