import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  sessionAccount: service('session-account'),

  init() {
    this._super(...arguments);
    this.session.on('authenticationSucceeded', () => this.sessionAuthenticated());
    this.session.on('invalidationSucceeded', () => this.session.handleInvalidation());
    this.session.on('authenticationRequested', () => this.session.triggerAuthentication('login'));
  },

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this.session.handleAuthentication('index');
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('sessionAccount').loadCurrentUser().catch(() => this.get('session').invalidate());
  }
});
