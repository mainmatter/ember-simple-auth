import RSVP from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const accountId = this.get('session.data.authenticated.account_id');
      if (!isEmpty(accountId)) {
        this.get('store').find('account', accountId).then((account) => {
          this.set('account', account);
          resolve();
        }, reject);
      } else {
        resolve();
      }
    });
  }
});
