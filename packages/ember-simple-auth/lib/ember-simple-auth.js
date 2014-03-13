import { setup, Configuration } from './ember-simple-auth/core';
import { Session } from './ember-simple-auth/session';
import { Authenticator } from './ember-simple-auth/authenticator';
import { Authorizer } from './ember-simple-auth/authorizer';
import { Stores } from './ember-simple-auth/stores';
import { ApplicationRouteMixin } from './ember-simple-auth/mixins/application_route_mixin';
import { AuthenticatedRouteMixin } from './ember-simple-auth/mixins/authenticated_route_mixin';
import { AuthenticationControllerMixin } from './ember-simple-auth/mixins/authentication_controller_mixin';
import { LoginControllerMixin } from './ember-simple-auth/mixins/login_controller_mixin';

/**
  Ember.SimpleAuth's main module.

  @module Ember.SimpleAuth
*/

export { setup, Configuration, Session, Authenticator, Authorizer, Stores, ApplicationRouteMixin, AuthenticatedRouteMixin, AuthenticationControllerMixin, LoginControllerMixin };
