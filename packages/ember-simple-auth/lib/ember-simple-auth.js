import setup from './ember-simple-auth/setup';
import initializeExtension from './ember-simple-auth/initialize_extension';
import Configuration from './ember-simple-auth/configuration';
import Session from './ember-simple-auth/session';
import BaseAuthenticator from './ember-simple-auth/authenticators/base';
import BaseAuthorizer from './ember-simple-auth/authorizers/base';
import BaseStore from './ember-simple-auth/stores/base';
import LocalStorageStore from './ember-simple-auth/stores/local_storage';
import EphemeralStore from './ember-simple-auth/stores/ephemeral';
import flatObjectsAreEqual from './ember-simple-auth/utils/flat_objects_are_equal';
import isSecureUrl from './ember-simple-auth/utils/is_secure_url';
import ApplicationRouteMixin from './ember-simple-auth/mixins/application_route_mixin';
import AuthenticatedRouteMixin from './ember-simple-auth/mixins/authenticated_route_mixin';
import AuthenticationControllerMixin from './ember-simple-auth/mixins/authentication_controller_mixin';
import LoginControllerMixin from './ember-simple-auth/mixins/login_controller_mixin';

/**
  Ember.SimpleAuth's main module.

  @module Ember.SimpleAuth
*/
export default {
  setup: setup,

  initializeExtension: initializeExtension,

  Session: Session,

  Authenticators: {
    Base: BaseAuthenticator
  },

  Authorizers: {
    Base: BaseAuthorizer
  },

  Stores: {
    Base: BaseStore,
    LocalStorage: LocalStorageStore,
    Ephemeral: EphemeralStore
  },

  Utils: {
    flatObjectsAreEqual: flatObjectsAreEqual,
    isSecureUrl: isSecureUrl
  },

  ApplicationRouteMixin:         ApplicationRouteMixin,
  AuthenticatedRouteMixin:       AuthenticatedRouteMixin,
  AuthenticationControllerMixin: AuthenticationControllerMixin,
  LoginControllerMixin:          LoginControllerMixin
};
