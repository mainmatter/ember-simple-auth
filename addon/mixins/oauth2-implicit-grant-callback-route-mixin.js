import Ember from 'ember';

const { inject: { service }, Mixin, testing, computed, getOwner } = Ember;

/**
  __This mixin is used in the callback route when using OAuth2 Implicit Grant
  authentication.__ It defines an
  {{#chrossLink "OAuth2ImplicitGrantCallbackRouteMixin/activate:method"}}{{/crossLink}}
  method that retrieves and processes authentication parameters, such as
  `access_token`, from the hash parameters provided in the callback URL by
  the authenticating server. The parameters are then passed to the
  {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}

  @class OAuth2ImplicitGrantCallbackMixin
  @module ember-simple-auth/mixins/ouath2-implicit-grant-callback-mixin
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
   The authenticator that should be used to authenticate the callback.

   @property authenticator
   @type String
   @default null
   @public
   */
  authenticator: null,

  /**
   The error that ocurred during the authentication attempt.

   @property error
   @type String
   @default null
   @public
   */
  error: null,

  /**
   Authenticates the passed authentication server response and sets the error
   property if the authentication failed.

   @method activate
   @public
   */
  activate() {
    if (!testing && this.get('_isFastBoot')) {
      return;
    }

    let authenticator = this.get('authenticator');

    let hash = this._parseResponse(window.location.hash);

    return this.get('session').authenticate(authenticator, hash).catch((err) => {
      this.set('error', err);
    });
  },

  _isFastBoot: computed(function() {
    const fastboot = getOwner(this).lookup('service:fastboot');

    return fastboot ? fastboot.get('isFastBoot') : false;
  }),

  _parseResponse(locationHash) {
    let params = {};
    const query = locationHash.substring(locationHash.indexOf('?'));
    const regex = /([^#?&=]+)=([^&]*)/g;
    let match;

    // decode all parameter pairs
    while ((match = regex.exec(query)) !== null) {
      params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }

    return params;
  }
});
