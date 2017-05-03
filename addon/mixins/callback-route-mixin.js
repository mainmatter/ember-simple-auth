import Ember from 'ember';

const { inject: { service }, Mixin } = Ember;

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
    let authenticator = this.get('authenticator');

    let hash = '';

    // test if fastboot is available without requiring the fastboot service to be present
    if (typeof FastBoot === 'undefined') {
      hash = window.location.hash;
    }

    return this.get('session').authenticate(authenticator, hash).catch((err) => {
      this.set('error', err);
    });
  }
});
