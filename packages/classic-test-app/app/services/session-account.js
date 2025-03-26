import Service, * as s from '@ember/service';
const service = s.service ?? s.inject;

export default Service.extend({
  session: service('session'),
  store: service(),

  async loadCurrentUser() {
    let accountId = this.get('session.data.authenticated.account_id');
    if (accountId) {
      let account = await this.get('store').findRecord('account', accountId);
      this.set('account', account);
    }
  },
});
