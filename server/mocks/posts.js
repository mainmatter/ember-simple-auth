module.exports = function(app) {
  var express     = require('express');
  var postsRouter = express.Router();

  postsRouter.get('/', function(req, res) {
    if (/Bearer .+/.test(req.headers.authorization)) {
      res.status(200).send('{ "posts": [{ "id": 1, "title": "title 1", "body": "body 1"}, { "id": 2, "title": "title 2", "body": "body 2"}] }');
    } else {
      res.status(401).end();
    }
  });

  app.use('/posts', postsRouter);
};
