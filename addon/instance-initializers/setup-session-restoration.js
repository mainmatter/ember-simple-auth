export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = container.lookup('route:application');
  const session = container.lookup('session:main');
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
