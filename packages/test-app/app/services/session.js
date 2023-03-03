import { inject as service } from '@ember/service';

import Session from 'ember-simple-auth/services/session';

export default class SessionService extends Session {
  @service sessionAccount;

  handleAuthentication() {
    super.handleAuthentication(...arguments);

    this.sessionAccount.loadCurrentUser().catch(() => this.invalidate());
  }
}
