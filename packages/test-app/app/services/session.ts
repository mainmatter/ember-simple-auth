import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class SessionService extends Session {
  @service sessionAccount: any;

  handleAuthentication(routeAfterInvalidation: string) {
    super.handleAuthentication(routeAfterInvalidation);

    this.sessionAccount.loadCurrentUser().catch(() => (this as any).invalidate());
  }
}
