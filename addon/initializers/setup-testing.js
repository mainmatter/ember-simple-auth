import Ember from 'ember';
import Test from '../authenticators/test';

export default function setupTesting(registry) {
  if (Ember.testing) {
    registry.register('authenticator:test', Test);
  }
}
