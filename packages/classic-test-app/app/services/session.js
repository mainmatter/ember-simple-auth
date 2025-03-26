import * as s from '@ember/service';
const service = s.service ?? s.inject;
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({
  sessionAccount: service(),

  handleAuthentication() {
    this._super(...arguments);

    this.get('sessionAccount')
      .loadCurrentUser()
      .catch(() => this.invalidate());
  },
});
