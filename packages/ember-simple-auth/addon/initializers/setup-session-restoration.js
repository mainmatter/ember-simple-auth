import { getOwner } from '@ember/application';

export default function setupSessionRestoration(registry) {
  const ApplicationRoute = registry.resolveRegistration
    ? registry.resolveRegistration('route:application')
    : registry.resolve('route:application');

  ApplicationRoute.reopen({
    init() {
      this._super(...arguments);

      const originalBeforeModel = this.beforeModel;
      this.beforeModel = function() {
        if (!this.__usesApplicationRouteMixn__) {
          const sessionService = getOwner(this).lookup('service:session');
          sessionService._setupHandlers();
        }

        const session = getOwner(this).lookup('session:main');
        return session.restore().then(
          () => originalBeforeModel.apply(this, arguments),
          () => originalBeforeModel.apply(this, arguments)
        );
      };
    },
  });
}
