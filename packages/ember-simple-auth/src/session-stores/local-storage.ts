import { getOwner } from '@ember/application';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import isFastBoot from '../utils/is-fastboot';
import { action } from '@ember/object';

/**
  Session store that persists data in the browser's `localStorage`.

  __`localStorage` is not available in Safari when running in private mode. In
  general it is better to use the
  {@linkplain AdaptiveStore} that automatically falls back to
  the {@linkplain CookieStore} when `localStorage` is not
  available.__

  __This session store does not work with FastBoot. In order to use Ember
  Simple Auth with FastBoot, configure the
  {@linkplain CookieStore} as the application's session
  store.__

  @class LocalStorageStore
  @extends BaseStore
  @public
*/
export default class LocalStorageStore extends BaseStore {
  /**
    The `localStorage` key the store persists data in.

    @memberof LocalStorageStore
    @property key
    @type String
    @default 'ember_simple_auth-session'
    @public
  */
  key = 'ember_simple_auth-session';

  _isFastBoot: boolean = false;
  _lastData: Record<string, string> | null = null;

  constructor(owner: any) {
    super(owner);

    this._isFastBoot = isFastBoot(getOwner(this));
    if (!this.get('_isFastBoot')) {
      window.addEventListener('storage', this._handleStorageEvent);
    }
  }

  willDestroy() {
    if (!this.get('_isFastBoot')) {
      window.removeEventListener('storage', this._handleStorageEvent);
    }
  }

  /**
    Persists the `data` in the `localStorage`.

    @memberof LocalStorageStore
    @method persist
    @param {Object} data The data to persist
    @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data: Record<string, string>) {
    this._lastData = data;
    const stringifiedData = JSON.stringify(data || {});
    localStorage.setItem(this.key, stringifiedData);

    return Promise.resolve();
  }

  /**
    Returns all data currently stored in the `localStorage` as a plain object.

    @memberof LocalStorageStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = localStorage.getItem(this.key);

    return Promise.resolve(JSON.parse(data || '{}'));
  }

  /**
    Clears the store by deleting the
    {@linkplain LocalStorageStore.key} from
    `localStorage`.

    @memberof LocalStorageStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    localStorage.removeItem(this.key);
    this._lastData = {};

    return Promise.resolve();
  }

  @action
  _handleStorageEvent(e: StorageEvent) {
    if (e.key === this.get('key')) {
      this.restore().then(data => {
        if (!objectsAreEqual(data, this._lastData)) {
          this._lastData = data;
          this.trigger('sessionDataUpdated', data);
        }
      });
    }
  }

  setRedirectTarget(url: string) {
    localStorage.setItem(`${this.key}-redirectTarget`, url);
  }

  getRedirectTarget() {
    return localStorage.getItem(`${this.key}-redirectTarget`);
  }

  clearRedirectTarget() {
    return localStorage.removeItem(`${this.key}-redirectTarget`);
  }
}
