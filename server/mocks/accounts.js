module.exports = function(app) {
  var express        = require('express');
  var accountsRouter = express.Router();

  accountsRouter.get('/1', function(req, res) {
    res.status(200).send('{ "account": { "id": 1, "login": "letme", "name": "Some Person"} }');
  });

  app.use('/accounts', accountsRouter);
};
