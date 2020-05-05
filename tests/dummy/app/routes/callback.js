/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { parseResponse } from 'ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin';

export default Route.extend({
  session: service(),
  fastboot: service(),

  activate() {
    if (this.get('fastboot.isFastBoot')) {
      return;
    }

    let hash = parseResponse(window.location.hash);

    this.get('session').authenticate('authenticator:oauth2-implicit-grant', hash).catch((err) => {
      this.set('error', err);
    });
  },
});
