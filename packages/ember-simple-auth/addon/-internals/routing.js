import Ember from 'ember';
import isFastBoot from '../utils/is-fastboot';
import location from '../utils/location';

export function requireAuthentication(owner, transition) {
  let sessionService = owner.lookup('service:session');
  let isAuthenticated = sessionService.get('isAuthenticated');
  if (!isAuthenticated) {
    if (transition && isFastBoot(owner)) {
      const fastbootService = owner.lookup('service:fastboot');
      const cookiesService = owner.lookup('service:cookies');
      cookiesService.write('ember_simple_auth-redirectTarget', transition.intent.url, {
        path: '/',
        secure: fastbootService.get('request.protocol') === 'https'
      });
    } else if (transition) {
      sessionService.set('attemptedTransition', transition);
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
  let cookiesService = owner.lookup('service:cookies');
  const redirectTarget = cookiesService.read('ember_simple_auth-redirectTarget');

  let routerService = owner.lookup('service:router');

  if (attemptedTransition) {
    attemptedTransition.retry();
    sessionService.set('attemptedTransition', null);
  } else if (redirectTarget) {
    routerService.transitionTo(redirectTarget);
    cookiesService.clear('ember_simple_auth-redirectTarget');
  } else {
    routerService.transitionTo(routeAfterAuthentication);
  }
}

export function handleSessionInvalidated(owner, routeAfterInvalidation) {
  if (isFastBoot(owner)) {
    let routerService = owner.lookup('service:router');
    routerService.transitionTo(routeAfterInvalidation);
  } else {
    if (!Ember.testing) {
      location().replace(routeAfterInvalidation);
    }
  }
}
