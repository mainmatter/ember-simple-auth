import RSVP from 'rsvp';
import BaseAuthenticator from './base';
import { guidFor } from '@ember/object/internals';
import assign from '../utils/assign';

export function applyDefaultOptions(optionsToMerge, center = true) {
  let options = assign(
    {
      toolbar: false,
      location: false,
      directories: false,
      status: false,
      menubar: false,
      scrollbars: false,
      resizable: false,
      copyhistory: false,
      width: 500,
      height: 500,
    },
    optionsToMerge
  );

  if (center) {
    options.top =
      window.top.outerHeight / 2 + window.top.screenY - options.height / 2;
    options.left =
      window.top.outerWidth / 2 + window.top.screenX - options.width / 2;
  }

  return options;
}

export function stringyfyWindowOptions(options) {
  return Object.keys(options)
    .map(
      (option) =>
        `${option}=${
          typeof options[option] === 'boolean'
            ? Number(options[option])
            : options[option]
        }`
    )
    .join(',');
}

/**
 * Open a popup window and wait until it resolves with an url.
 * Expects the popup to redirect to a known HTML page within the project which triggers a message event.
 * Rejects the promise if the popup is closed before that happens.
 *
 * @param {string} url
 * @param {*} additional options passed to window.open
 * @returns {Promise<string>}
 */
export function openPopup(href, options = {}, center = true) {
  let popupWindow;
  let detach;
  let id = guidFor(new Date());

  return new RSVP.Promise((resolve, reject) => {
    let onMessage = (event) => {
      // Skip messages from other child windows and with different signatures
      if (event.source !== popupWindow || event.data !== id) {
        return;
      }

      detach();
      resolve(event.source.location.href);
    };

    let onBeforeUnload = () => {
      if (!popupWindow || popupWindow.closed) {
        return;
      }

      popupWindow.close();
    };

    detach = () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('unload', onBeforeUnload);
    };

    window.addEventListener('message', onMessage);
    window.addEventListener('beforeunload', onBeforeUnload);

    popupWindow = window.open(
      href,
      id,
      stringyfyWindowOptions(applyDefaultOptions(options, center))
    );

    // If the popup is closed before it redicted, reject
    let interval = setInterval(() => {
      if (popupWindow.closed) {
        clearInterval(interval);
        detach();
        reject();
      }
    }, 500);
  });
}

/**
 * @returns {string} an acceptably random string with 10 characters
 */
export function pseudoRandomString() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 10);
}

export default BaseAuthenticator.extend({
  redirectUrl: `${window.location.origin}/.well-known/ember-simple-auth-redirect.html`,
  authorizationUrl: '',

  redirectUrlKey: 'redirect_uri',
  stateKey: 'state',
  codeKey: 'code',

  restore(data) {
    return RSVP.resolve(data);
  },

  authenticate(options) {
    let state = pseudoRandomString();

    return openPopup(this.buildAuthorizationUrl({ options, state }))
      .then((href) => this.parseResponse(state, href))
      .catch(() => RSVP.reject('popup was closed without authentication'))
      .then((data) => this.exchangeCodeForToken(data));
  },

  invalidate() {
    return RSVP.resolve();
  },

  /**
   *
   * @param {any} options
   *
   * @returns {String}
   */
  buildAuthorizationUrl({ state }) {
    const url = new URL(this.authorizationUrl);

    url.searchParams.set(this.redirectUrlKey, this.redirectUrl);
    url.searchParams.set(this.stateKey, state);

    return url.toString();
  },

  /**
   * Parses the response from the popup window.
   * Override this method to handle the response in a different way.
   *
   * @param {string} href
   *
   * @returns {Promise<any>}
   */
  parseResponse({ href, state: _state }) {
    let url = new URL(href);
    let code = url.searchParams.get(this.codeKey);
    let state = url.searchParams.get(this.stateKey);

    if (!code) {
      throw new Error(`no ${this.codeKey} in response`);
    }

    if (!state) {
      throw new Error('no state in response');
    }

    if (state !== _state) {
      throw new Error(`${this.stateKey} does not match`);
    }

    return { code };
  },

  /**
   *
   */
  exchangeCodeForToken(/* data */) {
    throw new Error('exchangeCodeForToken not implemented');
  },
});
