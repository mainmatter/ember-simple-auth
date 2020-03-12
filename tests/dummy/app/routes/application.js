import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
  @service sessionAccount

  beforeModel() {
    return this._loadCurrentUser();
  }

  sessionAuthenticated() {
    super.sessionAuthenticated(...arguments);

    this._loadCurrentUser();
  }

  _loadCurrentUser() {
    return this.sessionAccount.loadCurrentUser().catch(() => this.session.invalidate());
  }
}
