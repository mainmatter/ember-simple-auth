import { getOwner } from '@ember/application';
import Configuration from '../configuration';
import { deprecate } from '@ember/debug';

export default function setupSessionRestoration(registry) {
  if (Configuration.useSessionSetupMethod) {
    // return early in case users chose to opt out of initializer behavior.
    return;
  }

  deprecate('Ember Simple Auth: The automatic session initialization is deprecated. Please inject session service in your application route and call the setup method manually.', false, {
    id: 'ember-simple-auth.initializer.setup-session-restoration',
    until: '5.0.0',
    for: 'ember-simple-auth',
    since: {
      enabled: '4.1.0'
    }
  });

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
