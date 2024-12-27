import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import BaseAuthenticator from './base';
import { waitFor } from '@ember/test-waiters';

const JSON_CONTENT_TYPE = 'application/json';

export type NestedRecord = Record<string, string | Record<string, string>>;

/**
  Authenticator that works with the Ruby gem
  [devise](https://github.com/plataformatec/devise).

  __As token authentication is not actually part of devise anymore, the server
  needs to implement some customizations__ to work with this authenticator -
  see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).

  @class DeviseAuthenticator
  @extends BaseAuthenticator
  @public
*/
export default class DeviseAuthenticator extends BaseAuthenticator {
  /**
    The endpoint on the server that the authentication request is sent to.

    @memberof DeviseAuthenticator
    @property serverTokenEndpoint
    @type String
    @default '/users/sign_in'
    @public
  */
  serverTokenEndpoint = '/users/sign_in';

  /**
    The devise resource name. __This will be used in the request and also be
    expected in the server's response.__

    @memberof DeviseAuthenticator
    @property resourceName
    @type String
    @default 'user'
    @public
  */
  resourceName = 'user';

  /**
    The token attribute name. __This will be used in the request and also be
    expected in the server's response.__

    @memberof DeviseAuthenticator
    @property tokenAttributeName
    @type String
    @default 'token'
    @public
  */
  tokenAttributeName = 'token';

  /**
    The identification attribute name. __This will be used in the request and
    also be expected in the server's response.__

    @memberof DeviseAuthenticator
    @property identificationAttributeName
    @type String
    @default 'email'
    @public
  */
  identificationAttributeName = 'email';

  /**
    Restores the session from a session data object; __returns a resolving
    promise when there are non-empty
    [token]{@linkplain DeviseAuthenticator.tokenAttributeName}
    and
    [identification]{@linkplain DeviseAuthenticator.identificationAttributeName}
    values in `data`__ and a rejecting promise otherwise.

    @memberof DeviseAuthenticator
    @method restore
    @param {Object} data The data to restore the session from
    @return {Promise} A promise that when it resolves results in the session becoming or remaining authenticated
    @public
  */
  restore(data: Record<string, NestedRecord>) {
    return this._validate(data) ? Promise.resolve(data) : Promise.reject();
  }

  /**
    Authenticates the session with the specified `identification` and
    `password`; the credentials are `POST`ed to the
    [server]{@linkplain DeviseAuthenticator.serverTokenEndpoint}.
    If the credentials are valid the server will responds with a
    [token]{@linkplain DeviseAuthenticator.tokenAttributeName}
    and
    [identification]{@linkplain DeviseAuthenticator.identificationAttributeName}.
    __If the credentials are valid and authentication succeeds, a promise that
    resolves with the server's response is returned__, otherwise a promise that
    rejects with the server error is returned.

    @memberof DeviseAuthenticator
    @method authenticate
    @param {String} identification The user's identification
    @param {String} password The user's password
    @return {Promise} A promise that when it resolves results in the session becoming authenticated. If authentication fails, the promise will reject with the server response; however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
    @public
  */
  authenticate(identification: string, password: string) {
    return new Promise((resolve, reject) => {
      const { resourceName, identificationAttributeName, tokenAttributeName } = this.getProperties(
        'resourceName',
        'identificationAttributeName',
        'tokenAttributeName'
      );
      let data: NestedRecord = {};
      data[resourceName] = { password };
      data[resourceName][identificationAttributeName] = identification;

      this.makeRequest(data)
        .then(response => {
          if (response.ok) {
            response.json().then(json => {
              if (this._validate(json)) {
                const resourceName = this.get('resourceName');
                const _json = json[resourceName] ? json[resourceName] : json;
                run(null, resolve, _json);
              } else {
                run(
                  null,
                  reject,
                  `Check that server response includes ${tokenAttributeName} and ${identificationAttributeName}`
                );
              }
            });
          } else {
            run(null, reject, response);
          }
        })
        .catch(error => run(null, reject, error));
    });
  }

  /**
    Does nothing

    @memberof DeviseAuthenticator
    @method invalidate
    @return {Promise} A resolving promise
    @public
  */
  invalidate() {
    return Promise.resolve();
  }

  /**
    Makes a request to the Devise server using
    [ember-fetch](https://github.com/stefanpenner/ember-fetch).

    @memberof DeviseAuthenticator
    @method makeRequest
    @param {Object} data The request data
    @param {Object} options request options that are passed to `fetch`
    @return {Promise} The promise returned by `fetch`
    @protected
  */
  @waitFor
  makeRequest(data: NestedRecord, options: { url?: string } = {}) {
    let url = options.url || this.get('serverTokenEndpoint');
    let requestOptions = {};
    let body = JSON.stringify(data);
    Object.assign(requestOptions, {
      body,
      method: 'POST',
      headers: {
        accept: JSON_CONTENT_TYPE,
        'content-type': JSON_CONTENT_TYPE,
      },
    });
    Object.assign(requestOptions, options || {});

    return fetch(url, requestOptions);
  }

  _validate(data: Record<string, NestedRecord>) {
    const tokenAttributeName = this.get('tokenAttributeName');
    const identificationAttributeName = this.get('identificationAttributeName');
    const resourceName = this.get('resourceName');
    const _data = data[resourceName] ? data[resourceName] : data;

    return !isEmpty(_data[tokenAttributeName]) && !isEmpty(_data[identificationAttributeName]);
  }
}
