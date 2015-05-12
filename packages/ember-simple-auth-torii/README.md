__[The API docs for Ember Simple Auth torii are available here](http://ember-simple-auth.com/ember-simple-auth-torii-api-docs.html)__

# Ember Simple Auth torii

This is an extension to the Ember Simple Auth library that __provides an
authenticator that wraps [torii](https://github.com/Vestorly/torii)__ and thus
supports a variety of 3rd party authentication providers. For using this
extension library the Ember.js application also needs to load the torii
library.

__Ember Simple Auth torii requires Ember.js 1.6 or later!__

## The Authenticator

In order to use the torii authenticator (see the
[API docs for `Authenticators.Torii`](http://ember-simple-auth.com/ember-simple-auth-torii-api-docs.html#SimpleAuth-Authenticators-Torii))
the application needs to configure one or more torii providers, e.g.:

```js
ENV['torii'] = {
  providers: {
    'facebook-oauth2': {
      apiKey: '631252926924840'
    }
  }
};
```

To use this provider to authenticate the Ember Simple Auth session simply pass
the provider's name to the `authenticate` method of the session:

```js
this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-oauth2');
```

__The torii provider has to implement the `fetch` method to revalidate the
session after a refresh or when it changes. The `fetch` method is called with
the data returned from the provider's `open` method.__

## Authorization

Ember Simple Auth torii doesn't include an authorizer. In typical flows you
wouldn't use the authorization data obtained from the torii provider to
authorize requests against your API server directly anyway but exchange that
authorization data for a Bearer token for your API server first. That token
could then be used e.g. with the
[Ember Simple Auth OAuth 2.0 authorizer](http://ember-simple-auth.com/ember-simple-auth-oauth2-api-docs.html#SimpleAuth-Authorizers-OAuth2).

## Installation

To install Ember Simple Auth torii in an Ember.js application there are several
options:

* If you're using [Ember CLI](https://github.com/stefanpenner/ember-cli), just
  add the
  [Ember CLI Addon](https://github.com/simplabs/ember-cli-simple-auth-torii)
  to your project and Ember Simple Auth torii will setup itself.
* The Ember Simple Auth torii extension library is also included in the
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
