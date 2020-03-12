import RSVP from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class SessionAccountService extends Service {
  @service session;
  @service store;

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const accountId = this.session.data.authenticated.account_id;
      if (!isEmpty(accountId)) {
        this.store.find('account', accountId).then((account) => {
          this.account =  account;
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  }
}
