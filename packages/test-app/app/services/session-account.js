import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionAccountService extends Service {
  @service session;
  @service store;

  @tracked account;

  async loadCurrentUser() {
    let accountId = this.session.data.authenticated.account_id;
    if (accountId) {
      let account = await this.store.find('account', accountId);
      this.account = account;
    }
  }
}
