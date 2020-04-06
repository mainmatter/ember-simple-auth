'use strict';

const express = require('express');
const app = express();

let setupApp = require('./index.js')
setupApp(app);

module.exports = app;
