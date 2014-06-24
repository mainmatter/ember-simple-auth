__[The API docs for the cookie store are available here](http://ember-simple-auth.simplabs.com/simple-auth-cookie-store-api-docs.html)__

#  Ember Simple Auth Cookie Store

This is an extension to the Ember Simple Auth library that provides a __cookie
based session store__. It offers the same functionality as the standard
`localStorage` based store but __also supports older browsers__ that don't
support the `locaStorage` API.

## Using the Cookie Store

To use the cookie store, simply require its autoloader:

```js
require('simple-auth-cookie-store/ember');
```

which sets up an
[initializer](http://emberjs.com/api/classes/Ember.Application.html#toc_initializers)
named `'simple-auth-cookie-store'`, and configure it in the global environment
object:

```js
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  storeFactory: 'simple-auth-session-store:cookie'
}
```

## Installation

To install Ember Simple Auth Cookie Store in an Ember.js application there are
several options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add Ember Simple Auth to the `bower.json` file:

  ```js
  {
    "dependencies": {
      "simple-auth": "https://github.com/simplabs/ember-simple-auth-component.git"
    }
  }
  ```

  and import the library to the `Brocfile.js`:

  ```js
  app.import('vendor/ember-simple-auth/amd/simple-auth-cookie-store.amd.js', {
    // whitelist all modules you want to use, e.g.
    //
    // 'simple-auth/stores/cookie': ['default']
  });
  ```

* The bower component also includes a browserified version that can simply be
  loaded in the Ember.js application:

  ```html
  <script src="vendor/ember-simple-auth/simple-auth-cookie-store.js"></script>
  ```

* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
