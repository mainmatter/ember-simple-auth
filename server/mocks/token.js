module.exports = function(app) {
  var express     = require('express');
  var tokenRouter = express.Router();

  tokenRouter.post('/token', function(req, res) {
    if (request.body.grant_type === 'password') {
      if (request.body.username === 'letme' && request.body.password === 'in') {
        res.status(200).send('{ "access_token": "secret token!" }');
      } else {
        res.status(400).send('{ "error": "invalid_grant" }');
      }
    } else {
      res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
  });

  tokenRouter.post('/revoke', function(req, res) {
    if (request.body.token_type_hint === 'access_token' || request.body.token_type_hint === 'refresh_token') {
      res.status(200).end();
      success('');
    } else {
      res.status(400).send('{ "error": "unsupported_token_type" }');
    }
  });

  app.use('/', tokenRouter);
};
