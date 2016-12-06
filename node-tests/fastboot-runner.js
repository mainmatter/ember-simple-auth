/* global require, process */
var glob = require('glob');
var Mocha = require('mocha');

var root = 'node-tests/fastboot';

var mocha = new Mocha({
  timeout: 10000,
  reporter: 'spec'
});

var testFiles = glob.sync(root + '/**/*-test.js');

addFiles(mocha, testFiles);

try {
  runMocha();
} catch (error) {
  console.error(error);
  process.exit(1);
}

function addFiles(mocha, files) {
  files = (typeof files === 'string') ? glob.sync(root + files) : files;
  files.forEach(mocha.addFile.bind(mocha));
}

function runMocha() {
  mocha.run(function(failures) {
    process.on('exit', function() {
      process.exit(failures);
    });
  });
}
