module.exports = function(app) {
  var cors = require('cors');

  require("./mocks/accounts")(app);
  require("./mocks/posts")(app);
  require("./mocks/token")(app);

  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  // enable *all* CORS requests
  app.use(cors());
};
