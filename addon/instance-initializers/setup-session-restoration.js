export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = container.lookup('route:application');
  const session = container.lookup('session:main');
  applicationRoute.reopen({
    beforeModel() {
      const superResult = this._super(...arguments);
      return session.restore().then(() => superResult, () => superResult);
    }
  });
}
