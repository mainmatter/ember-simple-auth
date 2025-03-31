import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service session;
  @service sessionAccount;

  async beforeModel() {
    await this.session.setup();
    return this.sessionAccount.loadCurrentUser().catch(() => this.session.invalidate());
  }
}
