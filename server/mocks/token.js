module.exports = function(app) {
  var express     = require('express');
  var tokenRouter = express.Router();

  tokenRouter.post('/token', function(req, res) {
    if (req.body.grant_type === 'password') {
      if (req.body.username === 'letme' && req.body.password === 'in') {
        res.status(200).send('{ "access_token": "secret token!", "account_id": 1 }');
      } else {
        res.status(400).send('{ "error": "invalid_grant" }');
      }
    } else if (req.body.grant_type === 'facebook_auth_code') {
      if (req.body.auth_code) {
        res.status(200).send('{ "access_token": "secret token!", "account_id": 1 }');
      } else {
        res.status(400).send('{ "error": "invalid_grant" }');
      }
    } else {
      res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
  });

  tokenRouter.post('/revoke', function(req, res) {
    if (req.body.token_type_hint === 'access_token' || req.body.token_type_hint === 'refresh_token') {
      res.status(200).end();
    } else {
      res.status(400).send('{ "error": "unsupported_token_type" }');
    }
  });

  app.use('/', tokenRouter);
};
