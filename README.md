[![Build Status](https://travis-ci.org/simplabs/ember-simple-auth.png)](https://travis-ci.org/simplabs/ember-simple-auth)

#  Ember.SimpleAuth

Ember.SimpleAuth is a lightweight and unobtrusive library for implementing
token based authentication with [Ember.js](http://emberjs.com) applications. It
has minimal requirements with respect to the application structure, routes etc.
as well as the server interface.

## Token Based Authentication

The general idea behind token based authentication for Ember.js applications is
that the server provides an endpoint that the client uses to authenticate users
with their credentials and that - given the credentials are valid - responds
with a secret token that the client then uses to identify the user in
subsequent requests.

The secret token is usually sent in a custom header. Ember.SimpleAuth
uses ```X-AUTHENTICATION-TOKEN``` and automatically injects this header into
all AJAX requests.

## Usage

Ember.SimpleAuth only requires 2 routes and one template/controller. To enable
it it's best to use a custom initializer:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application);
  }
});
```

The routes for logging in and out can be named anything you want:

```js
App.Router.map(function() {
  this.route('login');
  this.route('logout');
});
```

To wire everything up, the generated ```App.LoginController``` and
```App.LogoutRoute``` need to implement the respective mixins provided by
Ember.SimpleAuth:

```js
App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);
App.LogoutRoute     = Ember.Route.extend(Ember.SimpleAuth.LogoutRouteMixin);
```

The last step is to add a template that renders the login form:

```html
<form {{action login on='submit'}}>
  <label for="identification">Login</label>
  {{view Ember.TextField id='identification' valueBinding='identification' placeholder='Enter Login'}}
  <label for="password">Password</label>
  {{view Ember.TextField id='password' type='password' valueBinding='password' placeholder='Enter Password'}}
  <button type="submit">Login</button>
</form>
```
At this point the infrastructure for users to log in and out is set up. Also
every AJAX request (unless it's a cross domain request) will include
[the authentication header](#token-based-authentication).

To actually make a route in the application protected and inaccessible when no
user is authenticated, simply implement the
```Ember.SimpleAuth.AuthenticatedRouteMixin``` in the respective route:

```js
App.Router.map(function() {
  this.route('protected');
});
App.ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
```

This will make the route redirect to ```/login``` (or a different URL if
configured) when no user is authenticated.

The current session can always be accessed as ```session```. To display
login/logout buttons depending on whether the user is currently authenticated
or not, simple add sth. like this to the respective template:

```html
{{#if session.isAuthenticated}}
  {{#link-to 'logout'}}Logout{{/link-to}}
  <p class="navbar-text pull-right">Your are currently signed in</p>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
```

For more examples including custom URLs, JSON payloads, error handling,
handling of the session user etc., see the [examples](#examples).

## The Server side

The only requirement on the server side is that there is an endpoint for
authenticating users that accepts the credentials as JSON via POST and an
endpoint that invalidates the secret token via DELETE. By default these
endpoints are expected as ```POST /session``` and ```DELETE /session``` but the
exact URLs can be customized.

The default request JSON sent to ```POST /session``` is as follows:

```json
{
  session: {
    identification: "<identification of the user - user name, email or whatever your server expects>",
    password:       "<secret!>"
  }
}
```

The response JSON expected by default is:

```json
{
  session: {
    authToken: "<secret token>"
  }
}
```

Both the request as well as the response JSON can be different than these
defaults and customization only needs a minimal account of code (see
_"Full-fledged example"_ in the examples).

In the case of ```DELETE /session``` no JSON is sent with the request and none
is expected in the response.

## Examples

To run the examples you need to have Ruby (at least version 1.9.3) and the
[bundler gem](http://bundler.io) installed. If you have that, you can run:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth/examples
bundle
./runner
```

Open [http://localhost:4567](http://localhost:4567) to access the examples.

## Installation

To install Ember.SimpleAuth in you Ember.js application you have several
options:

* If you're using [Bower](http://bower.io), just add it to your
  ```bower.json``` file:

```js
{
  "dependencies": {
    "ember-simple-auth": "https://github.com/simplabs/ember-simple-auth-component.git"
  }
}
```

* Download a prebuilt version from
  [the releases page](https://github.com/simplabs/ember-simple-auth/releases)
* [Build it yourself](#building)

## Building

To build Ember.SimpleAuth yourself you need to have Ruby (at least version
1.9.3) and the [bundler gem](http://bundler.io) installed. If you have that,
building is as easy as running:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
bundle
bundle exec rake dist
```

After running that you find the compiled source file (including a minified
version) in the ```dist``` directory.

If you want to run the tests as well you also need
[PhantomJS](http://phantomjs.org). You can run the tests with:

```bash
bundle exec rake test
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
