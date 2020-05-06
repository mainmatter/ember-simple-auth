import Service, { inject as service } from '@ember/service';

export default Service.extend({
  session: service('session'),
  store: service(),

  async loadCurrentUser() {
    let accountId = this.get('session.data.authenticated.account_id');
    if (accountId) {
      let account = await this.get('store').find('account', accountId);
      this.set('account', account);
    }
  }
});
