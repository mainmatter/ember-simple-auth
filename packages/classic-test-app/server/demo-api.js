'use strict';

var express = require('express');
var app = express();
// eslint-disable-next-line no-unused-vars
var server = require('./index.js')(app);

app.listen(process.env.PORT, function() {
  // eslint-disable-next-line no-console
  console.log('Server started on port ' + process.env.PORT);
});
