export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = container.lookup('route:application');
  const session = container.lookup('session:main');
  const originalMethod = applicationRoute.beforeModel.bind(applicationRoute);
  applicationRoute.reopen({
    beforeModel() {
      return session.restore().then(() => originalMethod(...arguments), () => originalMethod(...arguments));
    }
  });
}
