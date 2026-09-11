import SessionService from 'ember-simple-auth/services/session';
import CookieStore from 'ember-simple-auth/session-stores/cookie';
import EphemeralStore from 'ember-simple-auth/session-stores/ephemeral';

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;
type Assert<Condition extends true> = Condition;

type SessionData = {
  authenticated: {
    userId: string;
  };
  locale: string;
};

declare class CookieSessionService extends SessionService<SessionData, CookieStore> {
  createSessionStore(owner: any): CookieStore;
}

class LegacySessionService extends SessionService<SessionData> {
  declare store: CookieStore;
}

export type ConfiguredStoreTypeIsUsed = Assert<Equal<CookieSessionService['store'], CookieStore>>;
export type DefaultStoreRemainsUnknown = Assert<Equal<SessionService['store'], unknown>>;
export type ConfiguredDataTypeIsPreserved = Assert<
  Equal<CookieSessionService['data'], SessionData>
>;
export type CookieExpirationTime = CookieSessionService['store']['cookieExpirationTime'];
export type LegacyDeclaredStoreIsPreserved = Assert<
  Equal<LegacySessionService['store'], CookieStore>
>;
export type LegacySessionDataIsPreserved = Assert<Equal<LegacySessionService['data'], SessionData>>;
export type AuthenticatedUserId = LegacySessionService['data']['authenticated']['userId'];

// @ts-expect-error The configured store has no arbitrary properties.
export type InvalidStoreProperty = CookieSessionService['store']['notAStoreProperty'];

// @ts-expect-error The session data generic has no arbitrary properties.
export type InvalidSessionDataProperty = LegacySessionService['data']['notSessionData'];

declare class InvalidStoreSessionService extends SessionService<SessionData, CookieStore> {
  // @ts-expect-error The factory must return the configured store type.
  createSessionStore(owner: any): EphemeralStore;
}
