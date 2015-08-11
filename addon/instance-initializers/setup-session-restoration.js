export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = container.lookup('route:application');
  const session = container.lookup('simple-auth-session:main');
  applicationRoute.reopen({
    beforeModel() {
      const superResult = this._super(...arguments);
      const superReturn = function() {
        return superResult;
      };
      return session.restore().then(superReturn, superReturn);
    }
  });
}
