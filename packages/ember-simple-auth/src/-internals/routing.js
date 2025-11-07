import isFastBoot from '../utils/is-fastboot';
import location from '../utils/location';
import { isTesting } from '@embroider/macros';

export function requireAuthentication(owner, transition, extraArgs) {
  let sessionService = owner.lookup('service:session');
  let isAuthenticated = sessionService.get('isAuthenticated');
  if (!isAuthenticated) {
    const internalSession = sessionService.session;
    let redirectTarget = extraArgs?.redirectTarget;

    if (transition) {
      sessionService.set('attemptedTransition', transition);

      if (!redirectTarget) {
        redirectTarget = transition.intent.url;
      }
    }

    if (redirectTarget) {
      internalSession.setRedirectTarget(redirectTarget);
    }
  }
  return isAuthenticated;
}

export function triggerAuthentication(owner, authenticationRoute) {
  let authRouter = owner.lookup('service:router') || owner.lookup('router:main');
  authRouter.transitionTo(authenticationRoute);
}

export function prohibitAuthentication(owner, routeIfAlreadyAuthenticated) {
  let authRouter = owner.lookup('service:router') || owner.lookup('router:main');
  authRouter.transitionTo(routeIfAlreadyAuthenticated);
}

export function handleSessionAuthenticated(owner, routeAfterAuthentication) {
  let sessionService = owner.lookup('service:session');
  let attemptedTransition = sessionService.get('attemptedTransition');
  const internalSession = sessionService.session;
  const redirectTarget = internalSession.getRedirectTarget();

  let routerService = owner.lookup('service:router');

  if (attemptedTransition) {
    attemptedTransition.retry();
    sessionService.set('attemptedTransition', null);
  } else if (redirectTarget) {
    routerService.transitionTo(redirectTarget);
    internalSession.clearRedirectTarget();
  } else {
    routerService.transitionTo(routeAfterAuthentication);
  }
}

export function handleSessionInvalidated(owner, routeAfterInvalidation) {
  if (isFastBoot(owner)) {
    let routerService = owner.lookup('service:router');
    routerService.transitionTo(routeAfterInvalidation);
  } else {
    if (!isTesting()) {
      location.replace(routeAfterInvalidation);
    }
  }
}
