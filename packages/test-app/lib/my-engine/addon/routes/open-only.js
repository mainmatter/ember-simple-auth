import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OpenOnlyRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication(() => this.router.transitionToExternal('index'));
  }
}
