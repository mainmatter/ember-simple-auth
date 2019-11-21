[Back to Main README](../README.md)

# Full GitHub Authorization in Ember Octane with `torii-provider`

This guide is an update and reworking of [the guide provided by
`ember-simple-auth`](https://github.com/simplabs/ember-simple-auth/blob/master/guides/auth-torii-with-github.md),
but it uses Octane syntax and eschews jQuery. It also uses a production-ready
gatekeeper server instead of an `http-mock` server to provide the token
exchange. 

The [basic flow of authenticating with
GitHub](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
deserves an outline that is personalized for Ember:

1. When the user clicks the login button, the Ember application contacts
   `https://github.com/login/oauth/authorize` with your app’s `client_id`.
   GitHub presents a new window asking the user to authorize access to their
   GitHub account from your app. The user grants this.
2. GitHub redirects back to your app with an `authorizationCode`. This is
   proof of authorization, but your app still doesn’t know _who_ the user is
   (so it cannot connect to a `User` model, for example).
3. Your app sends the `authorizationCode` to a gatekeeper server you maintain,
   which in turn `POST`s the code to
   `https://github.com/login/oauth/access_token`. In development, this can be
   mocked. In production, it must be a separate server, about which more
   below, as we will use a separate server throughout.
4. GitHub responds to the `POST` with an `access_token`, which your gatekeeper
   server forwards to your app.
5. Your app uses the `access_token` in an `Authorization: Bearer
   <access_token>` header request to, say, `https://api.github.com/user`,
   which returns the GitHub user’s user info, at which point you can match the
   username with your `User` model or whatever. 

As with the original `ember-simple-auth` guide, the approach here mirrors any
OAuth2 explicit grant flow used also by Facebook, Google, etc. 

You can find a sequence diagram for the flow
[here](https://github.com/simplabs/ember-simple-auth/blob/master/guides/assets/esa-initial-flow.txt.png).

## Set up and Configuration

The following guide will teach you about the basics of OAuth, Github and
Ember, following these five major steps to implement Github Authorization in
your Ember app:

1. Register your future app with GitHub and get its keys.
2. Create a new Ember app
3. Install `ember-simple-auth`, `torii`, `ember-cli-dotenv`,
   `ember-data-github`, and `ember-fetch`.
4. Wire up the app with `application`, `index`, and `login` routes.
5. Configure Torii using the environment variables set in `.env`.


### Register your future app with GitHub

After logging in to GitHub, go to your [developer
settings](https://github.com/settings/developers) and, in the “OAuth Apps”
section, click on “New OAuth App.” Fill in the form much like in this image.
The first three fields can be filled out per your wishes, but take care with
the Authorization callback URL.

![Registering an OAuth Application with
GitHub](./assets/github-registering-oauth-application-2019.png)

Note that the callback URL is `http://localhost:4200/torii/redirect.html`. Torii
has [deprecated calling back to a non-static html
page](https://github.com/Vestorly/torii#oauth-redirects) as doing so is a
security vulnerability. Previously, it was normal to redirect back to the
Ember app itself.

You will likely want to register different application keys for development
and production, as the authorization callback URL will be different in both
cases. For development, `http://localhost:4200/torii/redirect.html` is
sufficient. For production, it will be
`http://<your-great-app-domain>/torii/redirect.html`.

Once you register your application, you will have a chance to add an
application logo.  Most importantly, you will be given a client ID and a
client secret. _The client secret must be kept secret and should never be
included in the Ember application's source!_ You will use the client ID in
your web application and the client secret in your back end token exchange
service.

### Create a new Ember app

First, [install Node.js](https://nodejs.org/en/download/). If you have a Mac
and are [using Homebrew](https://brew.sh/), this is as simple as running

```sh
brew install node
```

in the terminal.

Next, install [`ember-cli`](http://ember-cli.com) and use it to generate a new
Ember Octane app. Once the app is generated, you can enter into the newly
created directory and spin up the server.

```sh
npm install -g ember-cli
ember new my-ember-auth-octane-app -b @ember/octane-app-blueprint
cd my-ember-auth-octane-app
ember serve
```

After a bit, the terminal will show a “Slowest Nodes” screen, and then you can
open `http://localhost:4200` on your browser to see the Welcome page. Quit the
server by typing ctrl-C in the terminal, which will return you to the prompt.

### Install the needed addons

One of our needed addons requires the preexistence of two files before it will
install, so create a new file, `config/dotenv.js`:

```javascript
// config/dotenv.js
module.exports = function() {
  return {
    clientAllowedKeys: [
      "GITHUB_DEV_REDIRECT_URI",
      "GITHUB_DEV_CLIENT_ID",
      "DEV_TOKEN_EXCHANGE_URL"
    ],
    failOnMissingKey: false
  };
};
```

Then create `.env`, which should look something like this:

```sh
# .env
GITHUB_DEV_CLIENT_ID=<your GitHub client id created above>
GITHUB_DEV_REDIRECT_URI=http://localhost:4200/torii/redirect.html
DEV_TOKEN_EXCHANGE_URL=http://localhost:9999/authenticate
```

Now install the addons and ensure that Git forgets about `.env`.

```sh
ember install ember-simple-auth
ember install torii
ember install ember-cli-dotenv
ember install ember-fetch
ember install ember-data-github
echo ".env" >> .gitignore
```

Here, `ember-simple-auth` provides the underlying authentication layer, which
includes `session`, an [Ember
service](https://guides.emberjs.com/release/applications/services/) that
provides authentication persistence even when the server is restarted. Next,
`torii` provides the abstraction needed to write the GitHub-specific
authorization “provider.” `ember-cli-dotenv` allows us to use environment
variables defined in a `.env` file in our configuration files. Next,
`ember-fetch` uses JavaScript’s [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make
network requests, superseding jQuery’s `$.ajax()` method. Finally, the
`ember-data-github` addon provides adapters, serializers, and models for
working with GitHub.

### Wiring up the basic app

Our app will have an index route at `/` and a login route at `/login`. Also,
once we get to using `ember-simple-auth`, we’ll benefit from an application
route, too, so let’s create those first, along with some controllers we’ll
later need to control actions:

```sh
ember generate route application
ember generate route index
ember generate route login
ember generate controller application
ember generate controller login
```

Ember-cli will ask about overwriting `app/templates/application.hbs`. That’s
fine to do so. 

Now let’s create our skeletal templates by editing the three files in
`app/templates`:

```handlebars
{{!-- app/templates/application.hbs --}}
<h1>My Ember Octane App</h1>
<h2>Secret API Key: {{this.config.apiKey}}</h2>

<p>
  {{#if this.session.isAuthenticated}}
    Authenticated <br>
    <button {{on "click" this.logout}}>Log Out</button>
  {{else}}
    Unauthenticated
  {{/if}}
</p>
<hr>

{{outlet}}
```

```handlebars
{{!-- app/templates/index.hbs --}}
<h3>Index Route</h3>
{{#if this.session.data.authenticated.authorizationCode}}
  <p>Authorization Code: {{this.session.data.authenticated.authorizationCode}}</p>
{{/if}}
```

```handlebars
{{!-- app/templates/login.hbs --}}
<h3>Login Route</h3>
<button>Log in to GitHub</button>
```

If you are familiar with Ember but unfamiliar with prefixing properties with
`this` in Handlebars templates, this is a new Ember convention ([RFC
308](https://emberjs.github.io/rfcs/0308-deprecate-property-lookup-fallback.html))
reflected in Octane, where any property defined in a component is referred to
with `this` in its template. Here, we’re following the same convention, but
for controllers. Thus, `this.config` and `this.session` are properties that
will be defined on the route controllers in later steps.

When you spin up the server again with `ember serve`, you should see, at
`http://localhost:4200`, something like this:

![Initial Ember Octane App page](./assets/initial-ember-octane-app-page.png)

Incidentally, while the server was spinning up, it probably complained that
Torii has not yet been configured, so let’s do that.

### Configure Torii

Torii is configured in the file `config/environment.js`. Somewhere around the
seventh line, perhaps underneath `rootURL: "/"`, add:

```javascript
    torii: {
      sessionServiceName: "session",
      providers: {
        "github-oauth2": {
          scope: "repo user",
          apiKey: process.env.GITHUB_DEV_CLIENT_ID,
          redirectUri: process.env.GITHUB_DEV_REDIRECT_URI,
          tokenExchangeUri: process.env.DEV_TOKEN_EXCHANGE_URL
        }
      }
    },
```

When you spin up the server again, it will not complain about Torii’s being
unconfigured.

## Implement the first stage of GitHub authorization

OAuth is officially an authorization protocol, but is commonly used also for
authentication when the initial authorization code is obtained over `https`.
GitHub uses the OAuth [authorization code grant
type](https://tools.ietf.org/html/rfc6749#section-4.1), which requires two
steps. As noted at the top, the first step uses your client ID to get a
temporary authorization code. The temporary authorization code acts as a
single use bridge to authorization. 

### Add `ember-simple-auth` Mixins to Routes

Start by making use of the `ember-simple-auth` mixins that expose certain
methods to routes. Add them like this:

```javascript
// app/routes/application.js
import Route from "@ember/routing/route";
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";

export default class ApplicationRoute extends Route.extend(
  ApplicationRouteMixin
) {}
```

```javascript
// app/routes/index.js
import Route from "@ember/routing/route";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default class IndexRoute extends Route.extend(AuthenticatedRouteMixin) {
}
```

```javascript
// app/routes/login.js
import Route from "@ember/routing/route";
import UnauthenticatedRouteMixin from "ember-simple-auth/mixins/unauthenticated-route-mixin";

export default class LoginRoute extends Route.extend(
  UnauthenticatedRouteMixin
) {}
```

Now if you start up your app, you’ll notice that the app immediately redirects
to the `login` route, or `http://localhost:4200/login`. The
`AuthenticatedRouteMixin` makes routes available only to authenticated users.
The `UnauthenticatedRouteMixin` does the reverse. Hence, once the user
authenticates, they will no longer be able to visit the `login` route.

### Add Properties and Actions to App

Next, you can add properties and actions to the app to prepare it for
authentication.

First, instantiate the `session` service and add a `config` property on the
`application` controller and add the `session` service to the `login`
controller. Then we’ll also add `login()` and `logout()` actions:

```javascript
// app/controllers/application.js
import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
// Replace “my-ember-auth-octane-app” below with your app’s name
import config from "my-ember-auth-octane-app/config/environment";

export default class ApplicationController extends Controller {
  @service session;

  config = config.torii.providers["github-oauth2"];

  @action
  logout() {
    this.session.invalidate();
  }
}
```

```javascript
// app/controllers/login.js
import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class LoginController extends Controller {
  @service session;

  @action
  login() {
    this.session.authenticate("authenticator:torii", "github");
  }
}
```

These examples use some new Ember features, including native class syntax and
the `@service` and `@action` decorators. [This blog
post](https://blog.emberjs.com/2019/02/11/coming-soon-in-ember-octane-part-1.html)
describes these new syntactic features in greater detail. You can also read
more about decorators in Ember in the [Decorators
RFC](https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md).
Also, note on the second line of `app/controllers/application.js` that you
should import `config` from the `config` directory defined in terms of your
application.

If you restart your webserver now with `ember serve`, you should see your
GitHub client id, created at the beginning of this guide, appear on the second
line of your app, after “Secret API Key:.”

Of course, clicking on the “Log in to GitHub” button will not do anything,
because we have not yet defined the `torii` authenticator or the `github`
provider and because the template hasn’t connected the button to the `login()`
action. Those are the next two steps.

### Define Torii Authenticator and GitHub Provider

First, generate an authenticator for Torii.

```
ember generate authenticator torii
```

This creates a file, `app/authenticators/torii.js`, the contents of which we
can replace with:

```javascript
// app/authenticators/torii.js
import { inject as service } from "@ember/service";
import ToriiAuthenticator from "ember-simple-auth/authenticators/torii";

export default ToriiAuthenticator.extend({
  torii: service()
});
```

Next, we create the GitHub provider by creating a new folder,
`app/torii-providers/`, and creating a file inside it,
`app/torii-providers/github.js`:

```javascript
// app/torii-providers/github.js
import GitHubOAuth2Provider from "torii/providers/github-oauth2";

export default GitHubOAuth2Provider.extend({
});
```

### Enable Action on `login` Template Button and Authenticate

Change the `login` template to send the `login()` action when the button is pressed.

```handlebars
{{!-- app/templates/login.hbs --}}
<h3>Login Route</h3>
<button {{on "click" this.login}}>Log in to GitHub</button>
```

The “Log Out” button was already associated with the `logout()` action, but
because it has been impossible to authenticate, it has also been impossible to
see that button.

If you start up the server again and now click on “Log In to GitHub,” a small
popup window should appear asking for authorization, showing a GitHub icon and
your GitHub user avatar. Upon clicking the green “Authorize” button, the popup
should disappear and dump you back to your app, but now on the `index` route.
Underneath “Index Route,” you should also now see a line displaying the GitHub
authorization code.

We’ve now established the mechanism to obtain an authorization code from
GitHub. This doesn't authorize us fully to use the GitHub APIs, although
`ember-simple-auth` considers us authenticated at this point, hence
`this.session.isAuthenticated` evaluates to `true`.

The “Logout” button in the `application` template now appears, and if you
click on it, you will be dumped back to the `login` route. Logging in,
however, no longer requires authorization via the GitHub popup, because you
have already authorized your app. The popup still appears, but it flashes for
a second and then disappears.

This completes the second step of the outline at the top of this guide. Next
is performing the token exchange to enable getting user data from GitHub.

## Deploy a Gatekeeper Server for Token Exchange and Connect It to Ember

This aspect of the guide takes place outside of the context of your Ember app,
because GitHub will not permit token exchange to happen on a client-side
application. Luckily, spinning up a separate gatekeeper server is somewhat
straightforward, and there even is a Node application,
[Gatekeeper](prose/gatekeeper), designed to make the process even easier.

In short, the server must receive the authorization code your Ember app receives
from GitHub and forward it back to GitHub in a `POST` request, wait for a
response, and send it back to your Ember app.

Gatekeeper expects the authorization code to come at the end of a URL in the
format of `http://<gatekeeper-server>/authenticate/<authorization-code>`,
which is why we set the value of `DEV_TOKEN_EXCHANGE_URL` to
`http://localhost:9999/authenticate` in the `.env` file. This is the URL we
will shortly be using.

### Build the Gatekeeper Server

Outside of your Ember app’s directory, clone and prepare the Gatekeeper
server:

```sh
git clone https://github.com/prose/gatekeeper.git
cd gatekeeper
npm install
npm install dotenv
echo ".env" >> .gitignore
```

Now, as with the `.env` file in the Ember app, create a similar one in the
`gatekeeper` directory:

```sh
OAUTH_CLIENT_ID=<your GitHub client id created above>
OAUTH_CLIENT_SECRET=<your GitHub client secret created above>
```

Note that for the token exchange, you need both the client id _and_ the client
secret. These are the environment variable names Gatekeeper is expecting, so
do not change them. Finally, make the Gatekeeper server aware of the
environment variables by adding, at the very top of `index.js`:

```javascript
require("dotenv").config();
```

Start the Gatekeeper server with:

```sh
node index.js
```

The server should report to the console something like this:

```
Configuration
oauth_client_id: 5cb***
oauth_client_secret: 429***
oauth_host: github.com
oauth_port: 443
oauth_path: /login/oauth/access_token
oauth_method: POST
Gatekeeper, at your service: http://localhost:9999
```

The lines for the `oauth_client_id` and `oauth_client_secret` should look
similar to your client id and client secret. If they read `GIT***`, then the
environment variables did not catch. Make sure you added the `dotenv`
configuration line at the top of `index.js`.

### Wire the Gatekeeper Server back to Ember

Once more, though our app looks _authenticated_, it’s not _authorized_ to use
the GitHub APIs. Even though we _authorized_ the app to have access to our
GitHub account in order to get the authorization code. It’s confusing.

`torii` providers make use of the `open()` hook, so that’s the hook we will
add to our provider:

```javascript
// app/torii-providers/github.js
import GitHubOAuth2Provider from "torii/providers/github-oauth2";
import ajax from "ember-fetch/ajax";
import config from "../config/environment";

export default GitHubOAuth2Provider.extend({
  open() {
    return this._super().then(async ({ authorizationCode, provider }) => {
      const gatekeeperURL = 
        config.torii.providers["github-oauth2"].tokenExchangeUri;
      const response = await ajax(`${gatekeeperURL}/${authorizationCode}`)
      return { provider, access_token: response.token };
    });
  }
});
```

This adds an `access_token` property to the `session` service as well as a
`provider` property. 

Spin up the server once more and log in. Next, use the [Ember
Inspector](https://guides.emberjs.com/release/ember-inspector/) to inspect the
`session` service by clicking on “Container,” then “service”, then “session,”
then “session” under “Own properties.” Next, hover over the “content: {
authenticated: [Object] }” line and click on the “>$E.” Return to the console
and inspect what was logged to it. 

The `authenticated` object should have three properties: `access_token`,
`authenticator`, and `provider`. If you copy the token and use it in place of
`<OAUTH-TOKEN>` in this `curl` command:

```sh
curl -H "Authorization: Bearer <OAUTH-TOKEN>" https://api.github.com/user
```

You should receive your own user data flashed to the terminal. This sets the
stage for the final step, incorporating the access token in fetching the user
data from within Ember.

## Populate a Model with Data from GitHub

In previous versions of `ember-simple-auth`, this next step was cleanly
accomplished with an `authorizer`, but authorizers [have been
deprecated](https://github.com/simplabs/ember-simple-auth#deprecation-of-authorizers).
Instead, we follow the instructions given by `ember-simple-auth`: “simply get
the session data from the session service and inject it where needed.” The
access token is inside the session data, and the only place where we need to
inject it is in one adapter. 

First, update the `index` route and template to read in the logged in user.
`ember-data-github` provides ad hoc models such as a “`github-user`” model you
can access in the `model` hook:

```javascript
// app/routes/index.js
import Route from "@ember/routing/route";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default class IndexRoute extends Route.extend(AuthenticatedRouteMixin) {
  model() {
    return this.store.findRecord("github-user", "#");
  }
}
```

Here, the `#` is an id representing the currently logged in user for
`ember-data-github`.


```handlebars
{{!-- app/templates/index.hbs --}}
<h3>Index Route</h3>
{{#if this.session.data.authenticated.authorizationCode}}
  <p>Authorization Code: {{this.session.data.authenticated.authorizationCode}}</p>
{{/if}}
<img src={{this.model.avatarUrl}} alt="Avatar of {{this.model.login}}"> <br>
Login: {{this.model.login}} <br>
Full Name: {{this.model.name}}
```

If you launch the server now, you will get a blank page, and the console will
tell you that the call to `https://api.github.com/user` was unauthorized. We
can, however, extend the adapter for the `github-user` model and inject
authorization.

```sh
ember generate adapter github-user
```

Now replace `app/adapters/github-user.js` with:

```javascript
// app/adapters/github-user.js
import { computed } from "@ember/object";
import GitHubUserAdapter from "ember-data-github/adapters/github-user";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

export default GitHubUserAdapter.extend(DataAdapterMixin, {
  headers: computed("session.data.authenticated.access_token", function() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers.Authorization = `Bearer ${
        this.session.data.authenticated.access_token
      }`;
    }

    return headers;
  })
});
```

This adapter injects an authorization header into the GitHub request now.  The
`DataAdapterMixin` is a mixin provided by `ember-simple-auth` that injects the
`session` service. Otherwise, when you start up your server one last time, log
in via the `login` route, and get dumped back to the `index` route, you should
now see your avatar, your GitHub login name, and your full name.

Congrats!

## Next Steps

This all done, you have a crude Ember Octane app that authenticates with
GitHub, returning the logged in user. This model can then be used to populate
your “real” `User` model, perhaps.

Additionally, in production you cannot rely on using your local Gatekeeper
server, but luckily Gatekeeper includes documentation on [deploying to
Heroku](https://github.com/prose/gatekeeper#deploy-on-heroku) and similar
services. Then, update the appropriate line in your Ember app’s `.env` to
point to the Heroku url, not `http://localhost:9999/authenticate`.

Finally, I’ve created a repo of the “finished” version of this guide, and it
is available at
[@muziejus/ember-simple-auth-github-octane](http://github.com/muziejus/ember-simple-auth-github-octane).

Here are some other links provided by [@srvance](http://github.com/srvance),
[@aspala](http://github.com/aspala), [@marcoow](http://github.com/marcoow),
and [@jordan-storz](http://github.com/jordan-storz), the authors of the
original version of this guide:

* [simple-auth-torii-github-demo](https://github.com/srvance/simple-auth-torii-github-demo) is a repo created to follow
the steps of this guide. All elements of the guide except the token exchange service are contained here.
* [github-stars](https://github.com/hawkup/github-stars) has multiple implementations of the
same app to display your starred repos in various web app frameworks. The `emberjs`
directory contains the implementation for Ember.
* [GitHub Social Authentication with Ember Simple Auth and Torii](https://disjoint.ca/til/2016/03/21/github-social-authentication-with-ember-simple-auth-and-torii/)
addresses some very specific issues but has a helpful overall recipe to get things working.
* [Real-world Authentication with Ember Simple Auth](https://emberigniter.com/real-world-authentication-with-ember-simple-auth/)
adds `ember-simple-auth` to the application developed in its preceding post.
* The [GitHub OAuth Web Application Flow](https://developer.github.com/v3/oauth/#web-application-flow)
tells you what GitHub expects of your app.
