'use strict';

const FastBootAppServer = require('fastboot-app-server');

let server = new FastBootAppServer({
  distPath: 'dist',
  port: process.env.PORT || 3000,
  gzip: true // Optional - Enables gzip compression.
});

server.start();
