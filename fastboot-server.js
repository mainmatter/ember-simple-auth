const FastBootAppServer = require('fastboot-app-server');

let server = new FastBootAppServer({
  distPath: 'dist',
  gzip: true // Optional - Enables gzip compression.
});

server.start();
