import setupSession from './setup-session';
import Adaptive from '../session-stores/adaptive';
import LocalStorage from '../session-stores/local-storage';
import Cookie from '../session-stores/cookie';

export default {
  name: 'ember-simple-auth',

  initialize(registry) {
    const ENV = registry.resolveRegistration('config:environment');
    const { useResolver = true } = ENV['ember-simple-auth'] || {};
    if (!useResolver) {
      return;
    }

    registry.register('session-store:adaptive', Adaptive);
    registry.register('session-store:cookie', Cookie);
    registry.register('session-store:local-storage', LocalStorage);
    setupSession(registry);
  },
};
