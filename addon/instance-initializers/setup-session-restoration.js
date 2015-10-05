import lookup from '../utils/lookup';

export default function setupSessionRestoration(instance) {
  const applicationRoute = lookup(instance, 'route:application');
  const session = lookup(instance, 'session:main');
  const originalBeforeModel = applicationRoute.beforeModel;
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
