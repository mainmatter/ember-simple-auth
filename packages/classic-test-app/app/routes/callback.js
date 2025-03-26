import Route from '@ember/routing/route';
import * as s from '@ember/service';
const service = s.service ?? s.inject;
import { parseResponse } from 'ember-simple-auth/authenticators/oauth2-implicit-grant';

export default Route.extend({
  session: service(),

  activate() {
    if (!this.fastboot.isFastBoot) {
      let hash = parseResponse(window.location.hash);

      this.get('session')
        .authenticate('authenticator:oauth2-implicit-grant', hash)
        .catch(error => {
          this.set('error', error);
        });
    }
  },
});
