import { bind } from '@ember/runloop';
import { getOwner } from '@ember/application';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';
import isFastBoot from '../utils/is-fastboot';

/**
  Session store that persists data in the browser's `sessionStorage`.

  __`sessionStorage` is not available in Safari when running in private mode.__

  __This session store does not work with FastBoot. In order to use Ember
  Simple Auth with FastBoot, configure the
  {@linkplain CookieStore} as the application's session
  store.__

  @class SessionStorageStore
  @extends BaseStore
  @public
*/
export default class SessionStorageStore extends BaseStore {
  /**
    The `sessionStorage` key the store persists data in.

    @memberof SessionStorageStore
    @property key
    @type String
    @default 'ember_simple_auth-session'
    @public
  */
  key = 'ember_simple_auth-session';
  _isFastBoot: boolean = false;
  _boundHandler: (e: any) => void;
  _lastData: Record<string, string> | null = null;

  constructor(owner: any) {
    super(owner);

    this._isFastBoot = this.hasOwnProperty('_isFastBoot')
      ? this._isFastBoot
      : isFastBoot(getOwner(this));
    this._boundHandler = bind(this, this._handleStorageEvent);
    if (!this.get('_isFastBoot')) {
      window.addEventListener('storage', this._boundHandler);
    }
  }

  willDestroy() {
    if (!this.get('_isFastBoot')) {
      window.removeEventListener('storage', bind(this, this._handleStorageEvent));
    }
  }

  /**
    Persists the `data` in the `sessionStorage`.

    @memberof SessionStorageStore
    @method persist
    @param {Object} data The data to persist
    @return {Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
    @public
  */
  persist(data: Record<string, string>) {
    this._lastData = data;
    const stringifiedData = JSON.stringify(data || {});
    sessionStorage.setItem(this.key, stringifiedData);

    return Promise.resolve();
  }

  /**
    Returns all data currently stored in the `sessionStorage` as a plain object.

    @memberof SessionStorageStore
    @method restore
    @return {Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
    @public
  */
  restore() {
    let data = sessionStorage.getItem(this.key);

    return Promise.resolve(JSON.parse(data || '{}'));
  }

  /**
    Clears the store by deleting the
    {@linkplain sessionStorageStore.key} from
    `sessionStorage`.

    @memberof SessionStorageStore
    @method clear
    @return {Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
    @public
  */
  clear() {
    sessionStorage.removeItem(this.key);
    this._lastData = {};

    return Promise.resolve();
  }

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
}
