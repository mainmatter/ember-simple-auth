#  Ember.SimpleAuth

Ember.SimpleAuth is a small and unobtrusive library that helps you implement a
token based authentication mechanism with ember.js applications. It only has
minimal requirements with respect to the server API.

## Token Based Authentication

The general idea of token based authentication in ember.js applications is that
the server provides an endpoint that the client uses to authentication users
with their credentials and that - given the credentials are valid - responds
with a secret token that the client uses to identify itself in subsequent
requests.

The secret token is usually sent in a custom header. Ember.SimpleAuth uses
```X-AUTHENTICATION-TOKEN```.

## Usage

## The Server side

The minimal requirement on the server side is that there is an endpoint for authenticating
the user that accepts the credentials as JSON via POST and an endpoint that invalidates the
secret token via DELETE. By default these endpoints are expected as ```POST /session``` and
```DELETE /session``` but the exact URLs can be customized.

The default JSON for ```POST /session``` is as follows:

### Request

```json
{
  session: {
    identification: "<user name, email or other identification of the user>",
    password:       "<secret!>"
  }
}
```

### Response

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

## Installation

## Building

In order to build ember-simple-auth yourself you need to have Ruby and the
[bundler gem](http://bundler.io) installed. If you have that, building is
as easy as running:

```bash
git clone https://github.com/simplabs/ember-simple-auth.git
cd ember-simple-auth
bundle
bundle exec rake dist
```

After running that you find the compiled source file (including a minified
version) in the ```dist``` directory.
