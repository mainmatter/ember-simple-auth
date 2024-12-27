import EmberObject from '@ember/object';
import { TypedEventTarget, type TypedEventListener } from 'typescript-event-target';

export interface SessionEvents {
  sessionDataUpdated: CustomEvent<any>;
}

class SessionStoreEventTarget extends TypedEventTarget<SessionEvents> {}

/**
  The base class for all session stores. __This serves as a starting point for
  implementing custom session stores and must not be used directly.__

  Session Stores persist the session's state so that it survives a page reload
  and is synchronized across multiple tabs or windows of the same application.

  @class BaseStore
  @extends Ember.Object
  @public
*/
export default class EsaBaseSessionStore extends EmberObject {
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
  persist(..._args: any[]): Promise<unknown> {
    return Promise.reject();
  }

  /**
    Returns all data currently stored as a plain object.

    `BaseStores`'s implementation always returns a rejecting promise. __This
    method must be overridden in subclasses__.

    @memberof BaseStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore(..._args: any[]): Promise<unknown> {
    return Promise.reject();
  }

  /**
    Clears the store.

    `BaseStores`'s implementation always returns a rejecting promise. __This
    method must be overridden in subclasses__.

    @memberof BaseStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear(..._args: any[]): Promise<unknown> {
    return Promise.reject();
  }

  on<Event extends keyof SessionEvents>(
    event: Event,
    cb: TypedEventListener<SessionEvents, Event>
  ) {
    this.sessionStoreEvents.addEventListener(event, cb);
  }

  off<Event extends keyof SessionEvents>(
    event: Event,
    cb: TypedEventListener<SessionEvents, Event>
  ) {
    this.sessionStoreEvents.removeEventListener(event, cb);
  }

  trigger<Event extends keyof SessionEvents>(event: Event, value: SessionEvents[Event]['detail']) {
    let customEvent;
    if (value) {
      customEvent = new CustomEvent(event, { detail: value });
    } else {
      customEvent = new CustomEvent(event);
    }

    this.sessionStoreEvents.dispatchTypedEvent(event, customEvent);
  }
}
