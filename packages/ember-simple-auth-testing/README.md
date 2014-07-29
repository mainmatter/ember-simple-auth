# Ember Simple Auth Testing

This is an extension to the Ember Simple Auth library that provides test
helpers to authenticate and invalidate the session without having to stub
server responses etc.

## The Helpers

To authenticate the session, use the `authenticateSession` helper, e.g.:

```js
test('a protected route is accessible when the session is authenticated', function() {
  expect(1);
  authenticateSession();
  visit('/protected');

  andThen(function() {
    equal(currentRouteName(), 'protected');
  });
});
```

and to invalidate the session, use the `invaldiateSession` helper, e.g.:

```js
test('a protected route is not accessible when the session is not authenticated', function() {
  expect(1);
  invalidateSession();
  visit('/protected');

  andThen(function() {
    notEqual(currentRouteName(), 'protected');
  });
});
```

## Installation

To install Ember Simple Auth Testing in an Ember.js application there are
several options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add the
  [Ember CLI Addon](https://github.com/simplabs/ember-cli-simple-auth-testing)
  to your project. Also import the test helpers in `tests/helpers/start-app.js`
  before the export:

  ```js
  …
  import 'simple-auth-testing/test-helpers';

  export default function startApp(attrs) {
  …
  ```

  and add `"authenticateSession"` and `"invalidateSession"` to the `"predef"`
  section of `tests/.jshintrc`.

* The Ember Simple Auth testing extension library is also included in the
  _"ember-simple-auth"_ bower package both in a browserified version as well as
  an AMD build. If you're using the AMD build from bower be sure to require the
  test helpers explicitly:

  ```js
  require('simple-auth-testing/test-helpers');
  ```

  The browserified version will automatically register the test helpers once it
  is loaded in the application.
* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
