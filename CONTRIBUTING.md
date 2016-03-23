# Contributing to Ember Simple Auth

External contribution to Ember Simple Auth is highly appreciated of course - so
please give feedback, report issues or submit pull requests! Here's some
guidance to make contributing smooth for everybody.

## Issues

In order to make it easier for others to understand a reported issue, find
what's causing it and eventually fix it, here's a few things to keep in mind
when submitting issues:

1. Please only create issues for bugs, feature requests etc. - mere questions
  can be asked (and usually will be answered) on
  [stackoverflow](http://stackoverflow.com).
2. Update to the latest release of Ember Simple Auth if possible (see the
  [releases page](https://github.com/simplabs/ember-simple-auth/releases)).
3. Update to the latest releases of Ember.js, jQuery, Ember Data if possible
4. Include as much information as possible - this includes full stack traces
  etc.
5. Set up a demo that demonstrates the issue on [JSFiddle](https://jsfiddle.net/)
  or [JSBin](https://jsbin.com/). If your project is open source, provide a
  link to the online repo.

## Pull Requests

Here's a few steps to follow to make sure your pull request gets accepted:

1. Fork the repository and implement your changes; also add tests for any added
  functionality - remember that untested code is broken code!
2. Run the tests - pull requests with failing tests can't be accepted of
  course - find instructions on how to run the tests below.
3. Adhere to Ember Simple Auth's coding style; while there's no official style
  guide it should be clear by looking at the existing code what the agreed upon
  rules are.
4. Stash all your commits into one before submitting the pull request so it's
  easier to review them.
5. Provide a good description for your pull request - what does it add, why is
  that needed etc.?

## Run Tests

After you have forked the repository, run `npm install` and `bower install`.
Also install [PhantomJS](http://phantomjs.org/) to run the tests.

To run tests against the currently installed Ember version, run `ember test`. To
simulate a CI run -- testing multiple versions of Ember, Ember Data and the
included addon generators -- run `npm test && npm run nodetest`.
