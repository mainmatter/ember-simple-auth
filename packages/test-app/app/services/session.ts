import { service } from '@ember/service';
import { isTesting } from '@embroider/macros';
import Session from 'ember-simple-auth/services/session';
import TestAuthenticator from 'ember-simple-auth/authenticators/test';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import SessionStore from '../session-stores/application';
import OAuth2 from '../authenticators/oauth2';
import OAuth2ImplicitGrant from '../authenticators/oauth2-implicit-grant';
import Torii from '../authenticators/torii';

type Data = {
  authenticated: {
    id: string;
  };
};

export default class SessionService extends Session<Data> {
  @service declare sessionAccount: any;

  createSessionStore(owner: any) {
    const fastboot = owner.lookup('service:fastboot');
    if (isTesting() && !fastboot?.isFastBoot) {
      return new Ephemeral(owner);
    }

    return new SessionStore(owner);
  }

  createAuthenticators(owner: any) {
    return [
      new OAuth2(owner),
      new OAuth2ImplicitGrant(owner),
      new Torii(owner),
      ...(isTesting() ? [new TestAuthenticator(owner)] : []),
    ];
  }

  handleAuthentication(routeAfterInvalidation: string) {
    super.handleAuthentication(routeAfterInvalidation);

    this.sessionAccount.loadCurrentUser().catch(() => (this as any).invalidate());
  }
}

declare module '@ember/service' {
  interface Registry {
    session: SessionService;
  }
}
