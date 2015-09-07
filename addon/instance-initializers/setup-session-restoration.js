import Ember from 'ember';

const APPLICATION_ROUTE_KEY = 'route:application';

function ensureApplicationRoute(container) {
  let applicationRoute = container.lookup(APPLICATION_ROUTE_KEY);
  if (!applicationRoute) {
    applicationRoute = Ember.Route.extend();
    container.register(APPLICATION_ROUTE_KEY, applicationRoute);
  }
  return applicationRoute;
}

export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = ensureApplicationRoute(container);
  const session = container.lookup('session:main');
  const originalBeforeModel = applicationRoute.beforeModel || Ember.K;
  const applyOriginalBeforeModel = function() {
    return originalBeforeModel.apply(applicationRoute, arguments);
  };
  applicationRoute.reopen({
    beforeModel() {
      return session.restore().then(
        () => applyOriginalBeforeModel(...arguments),
        () => applyOriginalBeforeModel(...arguments)
      );
    }
  });
}
