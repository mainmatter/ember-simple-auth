interface Callback {
  (): void;
}
type Data = Record<string, unknown>;
interface SessionData<T> {
  authenticated: T;
}

declare module 'ember-simple-auth/services/session' {
  import Evented from '@ember/object/evented';
  import Service from '@ember/service';
  import type BaseSessionStore from 'ember-simple-auth/session-stores/base';
  import type Transition from '@ember/routing/-private/transition';

  export default class SessionService<T> extends Service.extend(Evented) {
    isAuthenticated: boolean;
    data: SessionData<T>;
    store: BaseSessionStore;
    attemptedTransition: Transition | null;

    authenticate(authenticator: string, ...args: unknown[]): Promise<void>;
    invalidate(...args: unknown[]): Promise<unknown>;
    requireAuthentication(transition: Transition, routeOrCallback: string | Callback): boolean;
    prohibitAuthentication(routeOrCallback: string | Callback): boolean;
    handleAuthentication(routeAfterAuthentication: string): void;
    handleInvalidation(routeAfterInvalidation: string): void;
    setup(): Promise<void>;
  }
}

declare module 'ember-simple-auth/authenticators/base' {
  import EmberObject from '@ember/object';
  import Evented from '@ember/object/evented';

  export default class extends EmberObject.extend(Evented) {
    restore(data: Data): Promise<unknown>;
    authenticate(...args: unknown[]): Promise<unknown>;
    invalidate(data: Data, ...args: unknown[]): Promise<unknown>;
  }
}

declare module 'ember-simple-auth/session-stores/base' {
  import EmberObject from '@ember/object';
  import Evented from '@ember/object/evented';

  export default class extends EmberObject.extend(Evented) {
    persist(data: SessionData<Data>): Promise<unknown>;
    restore(): Promise<SessionData<Data>>;
    clear(): Promise<void>;
  }
}

declare module 'ember-simple-auth/session-stores/local-storage' {
  import BaseSessionStore from 'ember-simple-auth/session-stores/base';

  export default class extends BaseSessionStore {
    key: string;
  }
}

declare module 'ember-simple-auth/session-stores/cookie' {
  import BaseSessionStore from 'ember-simple-auth/session-stores/base';

  export default class extends BaseSessionStore {
    cookieDomain: string;
    cookieExpirationTime: null | number;
    cookieName: string;
    cookiePath: string;
    sameSite: null | 'Strict' | 'Lax';
  }
}

declare module 'ember-simple-auth/session-stores/adaptive' {
  import CookieSessionStore from 'ember-simple-auth/session-stores/base';

  export default class extends CookieSessionStore {
    localStorageKey: string;
  }
}

declare module 'ember-simple-auth/session-stores/ephemeral' {
  import BaseSessionStore from 'ember-simple-auth/session-stores/base';

  export default class extends BaseSessionStore { }
}

declare module 'ember-simple-auth/session-stores/session-storage' {
  import BaseSessionStore from 'ember-simple-auth/session-stores/base';

  export default class extends BaseSessionStore {
    key: string;
  }
}

declare module 'ember-simple-auth/authenticators/test' {
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default class extends BaseAuthenticator { }
}

declare module 'ember-simple-auth/authenticators/devise' {
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default class extends BaseAuthenticator {
    serverTokenEndpoint: string;
    resourceName: string;
    tokenAttributeName: string;
    identificationAttributeName: string;
  }
}

declare module 'ember-simple-auth/authenticators/oauth2-implicit-grant' {
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default class extends BaseAuthenticator { }
}

declare module 'ember-simple-auth/authenticators/oauth2-password-grant' {
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default class extends BaseAuthenticator {
    clientId: string | null;
    serverTokenEndpoint: string;
    serverTokenRevocationEndpoint: string | null;
    refreshAccessTokens: boolean;
  }
}

declare module 'ember-simple-auth/authenticators/torii' {
  import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

  export default class extends BaseAuthenticator { }
}

declare module 'ember-simple-auth/test-support' {
  import SimpleAuthSessionService from 'ember-simple-auth/services/session';
  export function currentSession(): SimpleAuthSessionService<Data>;
  export function authenticateSession(sessionData: Data): Promise<void>;
  export function invalidateSession(): Promise<void>;
}
