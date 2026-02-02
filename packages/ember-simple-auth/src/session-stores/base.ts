import EmberObject from '@ember/object';
import EsaEventTarget, { type EventListener } from '../-internals/event-target';

export interface SessionEvents {
  sessionDataUpdated: CustomEvent<any>;
}

class SessionStoreEventTarget extends EsaEventTarget<SessionEvents> {}

/**
  The base class for all session stores. __This serves as a starting point for
  implementing custom session stores and must not be used directly.__

  Session Stores persist the session's state so that it survives a page reload
  and is synchronized across multiple tabs or windows of the same application.

  @class BaseStore
  @extends Ember.Object
  @public
*/
export default abstract class EsaBaseSessionStore extends EmberObject {
  sessionStoreEvents = new SessionStoreEventTarget();
  /**
    Triggered when the session store's data changes due to an external event,
    e.g., from another tab or window of the same application. The session
    handles that event, passes the updated data to its authenticator's
    {@linkplain BaseAuthenticator.restore} method and
    handles the result of that invocation accordingly.

    @memberof BaseStore
    @event sessionDataUpdated
    @param {Object} data The updated session data
    @public
  */

  /**
    Persists the `data`. This replaces all currently stored data.

    `BaseStores`'s implementation always returns a rejecting promise. __This
    method must be overridden in subclasses__.

    @memberof BaseStore
    @method persist
    @param {Object} data The data to persist
    @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  abstract persist(..._args: any[]): Promise<unknown>;

  /**
    Returns all data currently stored as a plain object.

    `BaseStores`'s implementation always returns a rejecting promise. __This
    method must be overridden in subclasses__.

    @memberof BaseStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  abstract restore(): Promise<unknown>;

  /**
    Clears the store.

    `BaseStores`'s implementation always returns a rejecting promise. __This
    method must be overridden in subclasses__.

    @memberof BaseStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  abstract clear(): Promise<unknown>;

  /**
    Called by {@linkplain SessionService.setRedirectTarget}.

    This method is used to persist a `redirectTarget` which is an alternative to the non-persistent {@linkplain SessionService.attemptedTransition}.
    `redirectTarget` is meant to replace {@linkplain SessionService.attemptedTransition} that is discarded the moment a browser tab is refreshed.

    This method is meant to be always implemented but can be `undefined` for backwards compatibility.
    Additionally can be assigned `null` to opt out of using this mechanism.

    @example
      setRedirectTarget = null;

    @memberof BaseStore
    @method setRedirectTarget
    @public
  */
  abstract setRedirectTarget(urL: string): void;

  /**
    Called by {@linkplain SessionService.getRedirectTarget}.

    This method is retrieve a persisted `redirectTarget` from a child class' store mechanism.
    Additionally can be assigned `null` to opt out of using this mechanism.

    @example
      getRedirectTarget = null;

    @memberof BaseStore
    @method getRedirectTarget
    @public
  */
  abstract getRedirectTarget(): string | null;

  /**
    Called by {@linkplain SessionService.clearRedirectTarget}.

    This method clears a `redirectTarget` from a child class' store mechanism.
    Additionally can be assigned `null` to opt out of using this mechanism.

    @example
      clearRedirectTarget = null;

    @memberof BaseStore
    @method clearRedirectTarget
    @public
  */
  abstract clearRedirectTarget(): void;

  on<Event extends keyof SessionEvents>(event: Event, cb: EventListener<SessionEvents, Event>) {
    this.sessionStoreEvents.addEventListener(event, cb);
  }

  off<Event extends keyof SessionEvents>(event: Event, cb: EventListener<SessionEvents, Event>) {
    this.sessionStoreEvents.removeEventListener(event, cb);
  }

  trigger<Event extends keyof SessionEvents>(event: Event, value: SessionEvents[Event]['detail']) {
    this.sessionStoreEvents.dispatchEvent(event, value);
  }
}
