import lookup from '../utils/lookup';
import { lookupFactory } from '../utils/lookup-factory';
import { register } from '../utils/register';

function reopenOrRegister(applicationInstance, factoryName, mixin) {
  const factory = lookup(applicationInstance, factoryName);
  if (factory) {
    factory.reopen(mixin);
  } else {
    const basicFactory = lookupFactory(applicationInstance, 'route:basic');
    const routeWithMixin = basicFactory.extend(mixin);
    register(applicationInstance, factoryName, routeWithMixin);
  }
}

export default function(applicationInstance, unauthenticatedRoutes, mixin) {
  unauthenticatedRoutes.forEach((routeName) => {
    const factoryName = `route:${routeName}`;
    reopenOrRegister(applicationInstance, factoryName, mixin);
  });
}
