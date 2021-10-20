import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('login');
  this.route('protected');
  this.route('auth-error');
  this.route('callback');
  this.mount('my-engine', { as: 'engine', path: '/engine' });
});
