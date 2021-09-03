### Call session#setup method in your ApplicationRoute
ESA implemented setup method on session service for users to manually implement in their ApplicationRoutes.
Reason being that ESA wants to move away from relying on initializers which have been spinning up the session services for you by default.

***READ THIS if you are on ESA 4.1.0 and want to opt-in into this behavior***
In order to opt-in into this early, you'll need to add some configuration for ember-simple-auth.

Inside your `ember-cli-build.js` you'll need to add `useSessionSetupMethod` flag and set it to `true`:
```js
  'ember-simple-auth': {
    useSessionSetupMethod: true,
  }
```
This will tell ESA to not use initializer to spin-up the session service.
And will exclude `routes/application.js` file from Ember Simple Auth addon which might've been causing some build issues while using with typescript.

With initializers gone, you'll need to call `session#setup` method directly in your application route.

```js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {
  @service session;

  async beforeModel() {
    await this.session.setup();
  }
}
```

If you had any custom setup in your `beforeModel` then you'll want to move this below the session setup to preserve timings.

***Old***
```
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {
  @service intl;

  beforeModel() {
    this.intl.setLocale('pl-PL');
  }
}
```


***New***
```js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {
  @service session;
  @service intl;

  async beforeModel() {
    await this.session.setup();
    this.intl.setLocale('pl-PL');
  }
}
```

