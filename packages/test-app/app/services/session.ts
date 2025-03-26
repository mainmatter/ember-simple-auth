import * as s from '@ember/service';
const service = s.service ?? s.inject;
import Session from 'ember-simple-auth/services/session';

type Data = {
  authenticated: {
    id: string;
  };
};

export default class SessionService extends Session<Data> {
  @service declare sessionAccount: any;

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
