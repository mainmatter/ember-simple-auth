module.exports = function(app) {
  var globSync = require('glob').sync;
  var bodyParser = require('body-parser');
  var cors = require('cors');
  var mocks = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  var proxies = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  // enable *all* CORS requests
  app.use(cors());

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });
};
