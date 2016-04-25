import '../router-dsl-ext';
import bootstrapRouting from '../bootstrap/routing';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export function initialize(applicationInstance) {
  const router = applicationInstance.get('router');
  const setupRoutes = function() {
    const unauthenticatedRoutes = router.router.unauthenticatedRoutes;
    const hasUnauthenticatedRoutes = !Ember.isEmpty(unauthenticatedRoutes);
    if (hasUnauthenticatedRoutes) {
      bootstrapRouting(applicationInstance, unauthenticatedRoutes, UnauthenticatedRouteMixin);
    }
    router.off('willTransition', setupRoutes);
  };
  router.on('willTransition', setupRoutes);
}

export default {
  name: 'setup-router',
  initialize
};
