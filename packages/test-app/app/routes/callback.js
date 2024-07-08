import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { parseResponse } from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

export default class CallbackRoute extends Route {
  @service fastboot;
  @service session;

  activate() {
    if (!this.fastboot.isFastBoot) {
      let hash = parseResponse(window.location.hash);

      this.session.authenticate('authenticator:oauth2-implicit-grant', hash).catch(error => {
        this.error = error;
      });
    }
  }
}
