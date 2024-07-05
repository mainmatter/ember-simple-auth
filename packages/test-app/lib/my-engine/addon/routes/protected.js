import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProtectedRoute extends Route {
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, () => this.router.transitionToExternal('login'));
  }
}
