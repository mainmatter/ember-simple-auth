import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class OpenOnlyRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication(() => this.transitionToExternal('index'));
  }
}
