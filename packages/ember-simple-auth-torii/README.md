__[The API docs for Ember Simple Auth Torii are available here](http://ember-simple-auth.com/ember-simple-auth-torii-api-docs.html)__

# Ember Simple Auth Torii

This is an extension to the Ember Simple Auth library that __provides an
authenticator that wraps [torii](https://github.com/Vestorly/torii)__ and thus
supports a variety of 3rd party authentication providers. For using this
extension library the Ember.js application also needs to load the torii
library.

__Ember Simple Auth Torii requires Ember.js 1.6 or later!__

## The Authenticator

In order to use the torii authenticator (see the
[API docs for `Authenticators.Torii`](http://ember-simple-auth.com/ember-simple-auth-torii-api-docs.html#SimpleAuth-Authenticators-Torii))
the application needs to configure one or more torii providers, e.g.:

```js
ENV['torii'] = {
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

## An authorizer

To make sure the token you just got from torii is sent along with your ajax
requests you need to add your own authorizer. The torii provider returns the
token from the Provider#open function. This can be different per provider. So
when you use several providers, you will have make sure you look at the right
properties to find the token. Most providers also return their name you could
use that to find out where the token is.

Read this: https://github.com/simplabs/ember-simple-auth#implementing-a-custom-authorizer.

## Installation

To install Ember Simple Auth Torii in an Ember.js application there are several
options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add the
  [Ember CLI Addon](https://github.com/simplabs/ember-cli-simple-auth-torii)
  to your project and Ember Simple Auth Torii will setup itself.
* The Ember Simple Auth Torii extension library is also included in the
  _"ember-simple-auth"_ bower package both in a browserified version as well as
  an AMD build. If you're using the AMD build from bower be sure to require the
  autoloader:

  ```js
  require('simple-auth-oauth2/ember');
  ```

  The browserified version will, like the Ember CLI addon, also setup itself
  once it is loaded in the application.
* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
