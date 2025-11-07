import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { findRecord } from '@warp-drive/utilities/json-api';

export default class SessionAccountService extends Service {
  @service session;
  @service store;

  @tracked account;

  async loadCurrentUser() {
    let accountId = this.session.data.authenticated.account_id;
    if (accountId) {
      let account = await this.store.request(findRecord('account', accountId.toString()));
      this.account = account.content.data;
    }
  }
}
