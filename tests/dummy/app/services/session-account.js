import Ember from 'ember';

const { inject: { service }, RSVP } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const accountId = this.get('session.data.authenticated.account_id');
      if (!Ember.isEmpty(accountId)) {
        return this.get('store').find('account', accountId).then((account) => {
          this.set('account', account);
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  }
});
