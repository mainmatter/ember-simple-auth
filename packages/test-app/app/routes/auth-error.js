import Route from '@ember/routing/route';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default class AuthErrorRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return this.store.findRecord('post', 3);
  }
}
