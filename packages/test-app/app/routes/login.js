import Route from '@ember/routing/route';
import * as s from '@ember/service';
const service = s.service ?? s.inject;

export default class LoginRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }
}
