import { getOwner } from '@ember/application';
import Configuration from '../configuration';

export default function setupSessionRestoration(registry) {
  if (Configuration.useSessionSetupMethod) {
    // return early in case users chose to opt out of initializer behavior.
    return;
  }

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
