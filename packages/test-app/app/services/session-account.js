import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { findRecord } from '@warp-drive/utilities/json-api';
import { getRequestState } from '@warp-drive/ember';

export default class SessionAccountService extends Service {
  @service session;
  @service store;

  @tracked account;

  async loadCurrentUser() {
    let accountId = this.session.data.authenticated.account_id;
    if (accountId) {
      let account = this.store.request(findRecord('account', accountId.toString()));
      this.account = getRequestState(account);
    }
  }
}
