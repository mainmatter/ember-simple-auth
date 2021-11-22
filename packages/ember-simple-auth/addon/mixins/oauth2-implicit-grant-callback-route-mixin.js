/* eslint-disable ember/no-new-mixins */

import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { deprecate } from '@ember/debug';
import location from '../utils/location';
import isFastBoot from '../utils/is-fastboot';
import { parseResponse } from '../authenticators/oauth2-implicit-grant';

deprecate("Ember Simple Auth: The OAuth2ImplicitGrantCallbackRouteMixin is now deprecated; call the session service's authenticate method with the appropriate authenticator in the respective route's activate method instead.", false, {
  id: 'ember-simple-auth.mixins.oauth2-implicit-grant-callback-route-mixin',
  until: '4.0.0',
  for: 'ember-simple-auth',
  since: {
    enabled: '3.1.0'
  }
});

/**
  __This mixin is used in the callback route when using OAuth 2.0 Implicit
  Grant authentication.__ It implements the
  {{#crossLink "OAuth2ImplicitGrantCallbackRouteMixin/activate:method"}}{{/crossLink}}
  method that retrieves and processes authentication parameters, such as
  `access_token`, from the hash parameters provided in the callback URL by
  the authentication server. The parameters are then passed to the
  {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}

  @class OAuth2ImplicitGrantCallbackRouteMixin
  @deprecated Call the session service's authenticate method with the appropriate authenticator in the respective route's activate method instead
  @module ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin
  @extends Ember.Mixin
  @public
*/

export default Mixin.create({
  /**
   The session service.

   @property session
   @readOnly
   @type SessionService
   @public
   */
  session: service('session'),

  /**
    The authenticator that should be used to authenticate the callback. This
    must be a subclass of the
    {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}
    authenticator.

    @property authenticator
    @type String
    @default null
    @public
  */
  authenticator: null,

  /**
    Any error that potentially occurs during authentication will be stored in
    this property.

    @property error
    @type String
    @default null
    @public
  */
  error: null,

  /**
    Passes the hash received with the redirection from the authentication
    server to the
    {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}} and
    authenticates the session with the authenticator.

    @method activate
    @public
  */
  activate() {
    let _isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : isFastBoot(getOwner(this));
    if (_isFastBoot) {
      return;
    }

    let authenticator = this.get('authenticator');

    let hash = parseResponse(location().hash);

    this.get('session').authenticate(authenticator, hash).catch((err) => {
      this.set('error', err);
    });
  },
});
