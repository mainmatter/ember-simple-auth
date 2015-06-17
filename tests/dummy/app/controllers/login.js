import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('session').authenticate('simple-auth-authenticator:oauth2-password-grant', data).catch((error) => {
        this.set('error', error.error);
      });
    }
  }
});
