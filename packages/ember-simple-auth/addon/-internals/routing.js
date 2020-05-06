import isFastBoot from '../utils/is-fastboot';

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
