import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  mySession: service('custom-session'),

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('mySession').authenticate('authenticator:oauth2-password-grant', data).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
