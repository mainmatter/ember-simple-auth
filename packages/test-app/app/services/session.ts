import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

type Data = {
  authenticated: {
    id: string;
  };
};

export default class SessionService extends Session<Data> {
  @service sessionAccount: any;

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
