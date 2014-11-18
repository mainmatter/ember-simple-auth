__[The API docs for the cookie store are available here](http://ember-simple-auth.com/ember-simple-auth-cookie-store-api-docs.html)__

#  Ember Simple Auth Cookie Store

This is an extension to the Ember Simple Auth library that provides a __cookie
based session store__. It offers the same functionality as the standard
`localStorage` based store but __also supports older browsers__ that don't
support the `locaStorage` API.

## Configuration

The Cookie Store can be configured via the application's environment object:

```js
//config/environment.js
ENV['simple-auth'] = {
  store: 'simple-auth-session-store:cookie'
}
```

## Installation

To install Ember Simple Auth Cookie Store in an Ember.js application there are
several options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add the
  [Ember CLI Addon](https://github.com/simplabs/ember-cli-simple-auth-cookie-store)
  to your project and Ember Simple Auth Cookie Store will setup itself.
* The Ember Simple Auth Cookie Store extenion library is also included in the
  _"ember-simple-auth"_ bower package both in a browserified version as well as
  an AMD build. If you're using the AMD build from bower be sure to require the
  autoloader:

  ```js
  require('simple-auth-cookie-store/ember');
  ```

  The browserified version will, like the Ember CLI addon, also setup itself
  once it is loaded in the application.
* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
