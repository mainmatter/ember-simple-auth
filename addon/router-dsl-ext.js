const Router = Ember.Router;
const proto = Ember.RouterDSL.prototype;

let currentMap = null;

proto.unauthenticatedRoute = function() {
  this.route.apply(this, arguments);
  currentMap.push(arguments[0]);
  console.log('adding new unauthed route');
};

Router.reopen({
  _initRouterJs() {
    currentMap = [];
    this._super.apply(this, arguments);
    this.router.unauthenticatedRoutes = currentMap;
  }
});
