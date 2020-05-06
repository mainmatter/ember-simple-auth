import SessionService from 'ember-simple-auth/services/session';
import { inject as service } from '@ember/service';

export default SessionService.extend({
  sessionAccount: service('session-account'),

  handleAuthentication() {
    this._super(...arguments);

    this.get('sessionAccount').loadCurrentUser().catch(() => this.invalidate());
  }
});
