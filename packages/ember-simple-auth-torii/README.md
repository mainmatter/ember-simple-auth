__[The API docs for Ember Simple Auth Torii are available here](http://ember-simple-auth.simplabs.com/ember-simple-auth-torii-api-docs.html)__

# Ember Simple Auth Torii

This is an extension to the Ember Simple Auth library that __provides an
authenticator that wraps [torii](https://github.com/Vestorly/torii)__ and thus
supports a variety of 3rd party authentication providers. For using this
extension library the Ember.js application also needs to load the torii
library.

__Ember Simple Auth Torii requires Ember.js 1.6 or later!__

## The Authenticator

In order to use the torii authenticator (see the
[API docs for `Authenticators.Torii`](http://ember-simple-auth.simplabs.com/ember-simple-auth-torii-api-docs.html#SimpleAuth-Authenticators-Torii))
wraps the [torii library](https://github.com/Vestorly/torii) the application
needs to configure one or more torii providers, e.g.:

```js
window.ENV = window.ENV || {};
window.ENV['torii'] = {
  providers: {
    'facebook-oauth2': {
      apiKey:      '631252926924840',
      redirectUri: document.location.href
    }
  }
};
```

To use this provider to authenticate the Ember Simple Auth session simply pass
the provider's name to the `authenticate` method of the session:

```js
this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-oauth2');
```

## Installation

To install Ember Simple Auth Torii in an Ember.js application there are several
options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add the
  [Ember CLI Addon](https://github.com/simplabs/ember-cli-simple-auth-torii)
  to your project.
* The Ember Simple Auth Torii extension library is also included in the
  _"ember-simple-auth"_ bower package both in a browserified version as well as
  an AMD build. If you're using the AMD build from bower be sure to require the
  autoloader:

  ```js
  require('simple-auth-oauth2/ember');
  ```

* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
