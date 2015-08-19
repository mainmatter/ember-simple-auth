export default function setupSessionRestoration(instance) {
  const { container } = instance;
  const applicationRoute = container.lookup('route:application');
  const session = container.lookup('session:main');
  applicationRoute.reopen({
    beforeModel(transition) {
      const boundSuper = this._super.bind(this);
      return session.restore().then(() => boundSuper(transition), () => boundSuper(transition));
    }
  });
}
