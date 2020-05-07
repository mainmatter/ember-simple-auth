import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('protected');
  this.route('open-only');
});
