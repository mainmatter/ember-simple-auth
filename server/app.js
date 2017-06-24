const express = require('express');
const app = express();
const server = require('./index.js')(app);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
