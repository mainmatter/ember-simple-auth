module.exports = function(app) {
  console.log('1'); 
  var globSync = require('glob').sync;
  console.log('2'); 
  var bodyParser = require('body-parser');
  console.log('3'); 
  var cors = require('cors');
  console.log('4'); 
  var mocks = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  console.log('mocks', mocks); 
  var proxies = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(function(req, res, next) {
    console.log('in the use!');
    next();
  });
  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  // enable *all* CORS requests
  app.use(cors());

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });
};
