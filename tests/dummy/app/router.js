import EmberRouter from '@ember/routing/router';
import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo', { path: '/' }, function() {
    this.route('index', { path: '/' });
    this.route('login');
    this.route('protected');
    this.route('auth-error');
    this.route('callback');
  });
  docsRoute(this, function() {
  /* Your docs routes go here */
    this.route('docs');
  });
});

export default Router;
