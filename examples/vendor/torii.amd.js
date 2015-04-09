/**
 * Torii version: 0.3.3
 * Built: Fri Apr 03 2015 21:03:47 GMT-0400 (EDT)
 */
define("torii/adapters/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var ApplicationAdapter = Ember.Object.extend({

      open: function(){
        return new Ember.RSVP.Promise(function(){
          throw new Error(
            'The Torii adapter must implement `open` for a session to be opened');
        });
      },

      fetch: function(){
        return new Ember.RSVP.Promise(function(){
          throw new Error(
            'The Torii adapter must implement `fetch` for a session to be fetched');
        });
      },

      close: function(){
        return new Ember.RSVP.Promise(function(){
          throw new Error(
            'The Torii adapter must implement `close` for a session to be closed');
        });
      }

    });

    __exports__["default"] = ApplicationAdapter;
  });
define("torii/bootstrap/session", 
  ["torii/session","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Session = __dependency1__["default"];

    __exports__["default"] = function(container, sessionName){
      container.register('torii:session', Session);
      container.injection('torii:session', 'torii', 'torii:main');
      container.injection('route',      sessionName, 'torii:session');
      container.injection('controller', sessionName, 'torii:session');

      return container;
    }
  });
define("torii/bootstrap/torii", 
  ["torii/torii","torii/providers/linked-in-oauth2","torii/providers/google-oauth2","torii/providers/facebook-connect","torii/providers/facebook-oauth2","torii/adapters/application","torii/providers/twitter-oauth1","torii/providers/github-oauth2","torii/providers/azure-ad-oauth2","torii/providers/stripe-connect","torii/services/popup","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __exports__) {
    "use strict";
    var Torii = __dependency1__["default"];
    var LinkedInOauth2Provider = __dependency2__["default"];
    var GoogleOauth2Provider = __dependency3__["default"];
    var FacebookConnectProvider = __dependency4__["default"];
    var FacebookOauth2Provider = __dependency5__["default"];
    var ApplicationAdapter = __dependency6__["default"];
    var TwitterProvider = __dependency7__["default"];
    var GithubOauth2Provider = __dependency8__["default"];
    var AzureAdOauth2Provider = __dependency9__["default"];
    var StripeConnectProvider = __dependency10__["default"];

    var PopupService = __dependency11__["default"];

    __exports__["default"] = function(container){
      container.register('torii:main', Torii);
      container.register('torii-provider:linked-in-oauth2', LinkedInOauth2Provider);
      container.register('torii-provider:google-oauth2', GoogleOauth2Provider);
      container.register('torii-provider:facebook-connect', FacebookConnectProvider);
      container.register('torii-provider:facebook-oauth2', FacebookOauth2Provider);
      container.register('torii-provider:twitter', TwitterProvider);
      container.register('torii-provider:github-oauth2', GithubOauth2Provider);
      container.register('torii-provider:azure-ad-oauth2', AzureAdOauth2Provider);
      container.register('torii-provider:stripe-connect', StripeConnectProvider);
      container.register('torii-adapter:application', ApplicationAdapter);

      container.register('torii-service:popup', PopupService);

      container.injection('torii-provider', 'popup', 'torii-service:popup');

      if (window.DS) {
        container.injection('torii-provider', 'store', 'store:main');
        container.injection('torii-adapter', 'store', 'store:main');
      }

      return container;
    }
  });
define("torii/configuration", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var get = Ember.get;

    var configuration       = get(window, 'ENV.torii') || {};
    configuration.providers = configuration.providers || {};

    function configurable(configKey, defaultValue){
      return Ember.computed(function(){
        var namespace = this.get('configNamespace'),
            fullKey   = namespace ? [namespace, configKey].join('.') : configKey,
            value     = get(configuration, fullKey);
        if (typeof value === 'undefined') {
          if (typeof defaultValue !== 'undefined') {
            if (typeof defaultValue === 'function') {
              return defaultValue.call(this);
            } else {
              return defaultValue;
            }
          } else {
            throw new Error("Expected configuration value "+fullKey+" to be defined!");
          }
        }
        return value;
      });
    }

    __exports__.configurable = configurable;

    __exports__["default"] = configuration;
  });
define("torii/initializers/initialize-torii-callback", 
  ["torii/redirect-handler","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var RedirectHandler = __dependency1__["default"];

    __exports__["default"] = {
      name: 'torii-callback',
      before: 'torii',
      initialize: function(container, app){
        app.deferReadiness();
        RedirectHandler.handle(window.location.toString())["catch"](function(){
          app.advanceReadiness();
        });
      }
    };
  });
define("torii/initializers/initialize-torii-session", 
  ["torii/configuration","torii/bootstrap/session","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var configuration = __dependency1__["default"];
    var bootstrapSession = __dependency2__["default"];

    __exports__["default"] = {
      name: 'torii-session',
      after: 'torii',

      initialize: function(container){
        if (configuration.sessionServiceName) {
          bootstrapSession(container, configuration.sessionServiceName);
          container.injection('adapter', configuration.sessionServiceName, 'torii:session');
        }
      }
    };
  });
define("torii/initializers/initialize-torii", 
  ["torii/bootstrap/torii","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var bootstrapTorii = __dependency1__["default"];
    var configuration = __dependency2__["default"];

    var initializer = {
      name: 'torii',
      initialize: function(container, app){
        bootstrapTorii(container);

        // Walk all configured providers and eagerly instantiate
        // them. This gives providers with initialization side effects
        // like facebook-connect a chance to load up assets.
        for (var key in  configuration.providers) {
          if (configuration.providers.hasOwnProperty(key)) {
            container.lookup('torii-provider:'+key);
          }
        }

        app.inject('route', 'torii', 'torii:main');
      }
    };

    if (window.DS) {
      initializer.after = 'store';
    }

    __exports__["default"] = initializer;
  });
define("torii/lib/load-initializer", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global Ember */
    __exports__["default"] = function(initializer){
      Ember.onLoad('Ember.Application', function(Application){
        Application.initializer(initializer);
      });
    }
  });
define("torii/lib/parse-query-string", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({
      init: function(url, validKeys) {
        this.url = url;
        this.validKeys = validKeys;
      },

      parse: function(){
        var url       = this.url,
            validKeys = this.validKeys,
            data      = {};

        for (var i = 0; i < validKeys.length; i++) {
          var key = validKeys[i],
              regex = new RegExp(key + "=([^&#]*)"),
              match = regex.exec(url);
          if (match) {
            data[key] = match[1];
          }
        }
        return data;
      }
    });
  });
define("torii/lib/query-string", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var camelize = Ember.String.camelize,
        get      = Ember.get;

    function isValue(value){
      return (value || value === false);
    }

    function getParamValue(obj, paramName, optional){
      var camelizedName = camelize(paramName),
          value         = get(obj, camelizedName);

      if (!optional) {
        if ( !isValue(value) && isValue(get(obj, paramName))) {
          throw new Error(
            'Use camelized versions of url params. (Did not find ' +
            '"' + camelizedName + '" property but did find ' +
            '"' + paramName + '".');
        }

        if (!isValue(value)) {
          throw new Error(
            'Missing url param: "'+paramName+'". (Looked for: property named "' +
            camelizedName + '".'
          );
        }
      }

      return isValue(value) ? encodeURIComponent(value) : undefined;
    }

    function getOptionalParamValue(obj, paramName){
      return getParamValue(obj, paramName, true);
    }

    __exports__["default"] = Ember.Object.extend({
      init: function(obj, urlParams, optionalUrlParams){
        this.obj               = obj;
        this.urlParams         = Ember.A(urlParams).uniq();
        this.optionalUrlParams = Ember.A(optionalUrlParams || []).uniq();

        this.optionalUrlParams.forEach(function(param){
          if (this.urlParams.indexOf(param) > -1) {
            throw new Error("Required parameters cannot also be optional: '" + param + "'");
          }
        }, this);
      },

      toString: function(){
        var urlParams         = this.urlParams,
            optionalUrlParams = this.optionalUrlParams,
            obj               = this.obj,
            keyValuePairs     = Ember.A([]);

        urlParams.forEach(function(paramName){
          var paramValue = getParamValue(obj, paramName);

          keyValuePairs.push( [paramName, paramValue] );
        });

        optionalUrlParams.forEach(function(paramName){
          var paramValue = getOptionalParamValue(obj, paramName);

          if (isValue(paramValue)) {
            keyValuePairs.push( [paramName, paramValue] );
          }
        });

        return keyValuePairs.map(function(pair){
          return pair.join('=');
        }).join('&');
      }
    });
  });
define("torii/lib/required-property", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function requiredProperty(){
      return Ember.computed(function(key){
        throw new Error("Definition of property "+key+" by a subclass is required.");
      });
    }

    __exports__["default"] = requiredProperty;
  });
define("torii/lib/state-machine", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /*
     * Modification of Stefan Penner's StateMachine.js: https://github.com/stefanpenner/state_machine.js/
     *
     * This modification requires Ember.js to be loaded first
     */

    var a_slice = Array.prototype.slice;
    var o_keys = Ember.keys;

    function makeArray(entry){
      if (entry.constructor === Array) {
        return entry;
      }else if(entry) {
        return [entry];
      }else{
        return [];
      }
    }

    function StateMachine(options){
      var initialState = options.initialState;
      this.states = options.states;

      if (!this.states) {
        throw new Error('StateMachine needs states');
      }

      this.state  = this.states[initialState];

      if (!this.state) {
        throw new Error('Missing initial state');
      }

      this.currentStateName = initialState;

      this._subscriptions = {};

      var beforeTransitions = (options.beforeTransitions ||[]);
      var afterTransitions  = (options.afterTransitions ||[]);
      var rule;

      var i, length;
      for(i = 0, length = beforeTransitions.length; length > i; i++){
        rule = beforeTransitions[i];
        this.beforeTransition.call(this, rule, rule.fn);
      }

      for(i = 0, length = afterTransitions.length; length > i; i++){
        rule = afterTransitions[i];
        this.afterTransition.call(this, rule, rule.fn);
      }
    }

    var SPLAT = StateMachine.SPLAT = '*';

    StateMachine.transitionTo = function(state){
      return function(){
        this.transitionTo(state);
      };
    };

    StateMachine.prototype = {
      states: {},
      toString: function(){
        return "<StateMachine currentState:'" + this.currentStateName +"' >";
      },

      transitionTo: function(nextStateName){
        if (nextStateName.charAt(0) === '.') {
          var splits = this.currentStateName.split('.').slice(0,-1);

          // maybe all states should have an implicit leading dot (kinda like dns)
          if (0 < splits.length){
            nextStateName = splits.join('.') + nextStateName;
          } else {
            nextStateName = nextStateName.substring(1);
          }
        }

        var state = this.states[nextStateName],
        stateName = this.currentStateName;

        if (!state) {
          throw new Error('Unknown State: `' + nextStateName + '`');
        }
        this.willTransition(stateName, nextStateName);

        this.state = state;

        this.currentStateName = nextStateName;
        this.didTransition(stateName, nextStateName);
      },

      beforeTransition: function(options, fn) {
        this._transition('willTransition', options, fn);
      },

      afterTransition: function(options, fn) {
        this._transition('didTransition', options, fn);
      },

      _transition: function(event, filter, fn) {
        var from = filter.from || SPLAT,
          to = filter.to || SPLAT,
          context = this,
          matchingTo, matchingFrom,
          toSplatOffset, fromSplatOffset,
          negatedMatchingTo, negatedMatchingFrom;

        if (to.indexOf('!') === 0) {
          matchingTo = to.substr(1);
          negatedMatchingTo = true;
        } else {
          matchingTo = to;
          negatedMatchingTo = false;
        }

        if (from.indexOf('!') === 0) {
          matchingFrom = from.substr(1);
          negatedMatchingFrom = true;
        } else {
          matchingFrom = from;
          negatedMatchingFrom = false;
        }

        fromSplatOffset = matchingFrom.indexOf(SPLAT);
        toSplatOffset = matchingTo.indexOf(SPLAT);

        if (fromSplatOffset >= 0) {
          matchingFrom = matchingFrom.substring(fromSplatOffset, 0);
        }

        if (toSplatOffset >= 0) {
          matchingTo = matchingTo.substring(toSplatOffset, 0);
        }

        this.on(event, function(currentFrom, currentTo) {
          var currentMatcherTo = currentTo,
            currentMatcherFrom = currentFrom,
            toMatches, fromMatches;

          if (fromSplatOffset >= 0){
            currentMatcherFrom = currentFrom.substring(fromSplatOffset, 0);
          }

          if (toSplatOffset >= 0){
            currentMatcherTo = currentTo.substring(toSplatOffset, 0);
          }

          toMatches = (currentMatcherTo === matchingTo) !== negatedMatchingTo;
          fromMatches = (currentMatcherFrom === matchingFrom) !== negatedMatchingFrom;

          if (toMatches && fromMatches) {
            fn.call(this, currentFrom, currentTo);
          }
        });
      },

      willTransition: function(from, to) {
        this._notify('willTransition', from, to);
      },

      didTransition: function(from, to) {
        this._notify('didTransition', from, to);
      },

      _notify: function(name, from, to) {
        var subscriptions = (this._subscriptions[name] || []);

        for( var i = 0, length = subscriptions.length; i < length; i++){
          subscriptions[i].call(this, from, to);
        }
      },

      on: function(event, fn) {
        this._subscriptions[event] = this._subscriptions[event] || [];
        this._subscriptions[event].push(fn);
      },

      off: function(event, fn) {
        var idx = this._subscriptions[event].indexOf(fn);

        if (fn){
          if (idx) {
            this._subscriptions[event].splice(idx, 1);
          }
        }else {
          this._subscriptions[event] = null;
        }
      },

      send: function(eventName) {
        var event = this.state[eventName];
        var args = a_slice.call(arguments, 1);

        if (event) {
          return event.apply(this, args);
        } else {
          this.unhandledEvent(eventName);
        }
      },

      trySend: function(eventName) {
        var event = this.state[eventName];
        var args = a_slice.call(arguments,1);

        if (event) {
          return event.apply(this, args);
        }
      },

      event: function(eventName, callback){
        var states = this.states;

        var eventApi = {
          transition: function() {
            var length = arguments.length,
            first = arguments[0],
            second = arguments[1],
            events = normalizeEvents(eventName, first, second);

            o_keys(events).forEach(function(from){
              var to = events[from];
              compileEvent(states, eventName, from, to, StateMachine.transitionTo(to));
            });
          }
        };

        callback.call(eventApi);
      },

      unhandledEvent: function(event){
        var currentStateName = this.currentStateName,
        message = "Unknown Event: `" + event + "` for: " + this.toString();

        throw new Error(message);
      }
    };

    function normalizeEvents(eventName, first, second){
      var events;
      if (!first) { throw new Error('invalid Transition'); }

      if (second) {
        var froms = first, to = second;
        events = expandArrayEvents(froms, to);
      } else {
        if (first.constructor === Object) {
          events = first;
        } else {
          throw new Error('something went wrong');
        }
      }

      return events;
    }

    function expandArrayEvents(froms, to){
      return  makeArray(froms).reduce(function(events, from){
         events[from] = to;
         return events;
       }, {});
    }

    function compileEvent(states, eventName, from, to, fn){
      var state = states[from];

      if (from && to && state) {
        states[from][eventName] = fn;
      } else {
        var message = "invalid transition state: " + (state && state.currentStateName) + " from: " + from+ " to: " + to ;
        throw new Error(message);
      }
    }

    __exports__["default"] = StateMachine;
  });
define("torii/load-initializers", 
  ["torii/lib/load-initializer","torii/initializers/initialize-torii","torii/initializers/initialize-torii-callback","torii/initializers/initialize-torii-session","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var loadInitializer = __dependency1__["default"];
    var initializeTorii = __dependency2__["default"];
    var initializeToriiCallback = __dependency3__["default"];
    var initializeToriiSession = __dependency4__["default"];

    __exports__["default"] = function(){
      loadInitializer(initializeToriiCallback);
      loadInitializer(initializeTorii);
      loadInitializer(initializeToriiSession);
    }
  });
define("torii/providers/azure-ad-oauth2", 
  ["torii/providers/oauth2-code","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Oauth2 = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    var computed = Ember.computed;

    /**
     * This class implements authentication against AzureAD
     * using the OAuth2 authorization flow in a popup window.
     * @class
     */
    var AzureAdOauth2 = Oauth2.extend({
      name: 'azure-ad-oauth2',

      baseUrl: computed(function() {
        return 'https://login.windows.net/' + this.get('tennantId') + '/oauth2/authorize';
      }),

      tennantId: configurable('tennantId', 'common'),

      // additional url params that this provider requires
      requiredUrlParams: ['state', 'api-version', 'client_id'],

      optionalUrlParams: ['scope', 'nonce', 'response_mode'],

      responseMode: configurable('responseMode', null),

      responseParams: computed(function () {
        return [ this.get('responseType') ];
      }),

      state: 'STATE',

      apiVersion: '1.0',

      responseType: configurable('responseType', 'code'),

      redirectUri: configurable('redirectUri', function(){
        // A hack that allows redirectUri to be configurable
        // but default to the superclass
        return this._super();
      })
    });

    __exports__["default"] = AzureAdOauth2;
  });
define("torii/providers/base", 
  ["torii/lib/required-property","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var requiredProperty = __dependency1__["default"];

    var computed = Ember.computed;

    /**
     * The base class for all torii providers
     * @class BaseProvider
     */
    var Base = Ember.Object.extend({

     /**
      * The name of the provider
      * @property {string} name
      */
      name: requiredProperty(),

      /**
       * The name of the configuration property
       * that holds config information for this provider.
       * @property {string} configNamespace
       */
      configNamespace: computed('name', function(){
        return 'providers.'+this.get('name');
      })

    });

    __exports__["default"] = Base;
  });
define("torii/providers/facebook-connect", 
  ["torii/providers/base","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /* global FB, $ */

    /**
     * This class implements authentication against facebook
     * connect using the Facebook SDK.
     */

    var Provider = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    var on = Ember.on;
    var fbPromise;

    function fbLoad(settings){
      if (fbPromise) { return fbPromise; }

      var original = window.fbAsyncInit;
      fbPromise = new Ember.RSVP.Promise(function(resolve, reject){
        window.fbAsyncInit = function(){
          FB.init(settings);
          Ember.run(null, resolve);
        };
        $.getScript('//connect.facebook.net/en_US/sdk.js');
      }).then(function(){
        window.fbAsyncInit = original;
        if (window.fbAsyncInit) {
          window.fbAsyncInit.hasRun = true;
          window.fbAsyncInit();
        }
      });

      return fbPromise;
    }

    function fbLogin(scope){
      return new Ember.RSVP.Promise(function(resolve, reject){
        FB.login(function(response){
          if (response.authResponse) {
            Ember.run(null, resolve, response.authResponse);
          } else {
            Ember.run(null, reject, response.status);
          }
        }, { scope: scope });
      });
    }

    function fbNormalize(response){
      return {
        userId: response.userID,
        accessToken: response.accessToken
      };
    }

    var Facebook = Provider.extend({

      // Required settings:
      name:  'facebook-connect',
      scope: configurable('scope', 'email'),
      appId: configurable('appId'),

      // API:
      //
      open: function(){
        var scope = this.get('scope');

        return fbLoad( this.settings() )
          .then(function(){
            return fbLogin(scope);
          })
          .then(fbNormalize);
      },

      settings: function(){
        return {
          status: true,
          cookie: true,
          xfbml: false,
          version: 'v2.0',
          appId: this.get('appId')
        };
      },

      // Load Facebook's script eagerly, so that the window.open
      // in FB.login will be part of the same JS frame as the
      // click itself.
      loadFbLogin: on('init', function(){
        fbLoad( this.settings() );
      })

    });

    __exports__["default"] = Facebook;
  });
define("torii/providers/facebook-oauth2", 
  ["torii/configuration","torii/providers/oauth2-code","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var configurable = __dependency1__.configurable;
    var Oauth2 = __dependency2__["default"];

    __exports__["default"] = Oauth2.extend({
      name:    'facebook-oauth2',
      baseUrl: 'https://www.facebook.com/dialog/oauth',

      // Additional url params that this provider requires
      requiredUrlParams: ['display'],

      responseParams: ['code'],

      scope:        configurable('scope', 'email'),

      display: 'popup',
      redirectUri: configurable('redirectUri', function(){
        // A hack that allows redirectUri to be configurable
        // but default to the superclass
        return this._super();
      }),

      open: function() {
        return this._super().then(function(authData){
          if (authData.authorizationCode && authData.authorizationCode === '200') {
            // indication that the user hit 'cancel', not 'ok'
            throw new Error('User canceled authorization');
          }

          return authData;
        });
      }
    });
  });
define("torii/providers/github-oauth2", 
  ["torii/providers/oauth2-code","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Oauth2 = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    /**
     * This class implements authentication against Github
     * using the OAuth2 authorization flow in a popup window.
     * @class
     */
    var GithubOauth2 = Oauth2.extend({
      name:       'github-oauth2',
      baseUrl:    'https://github.com/login/oauth/authorize',

      // additional url params that this provider requires
      requiredUrlParams: ['state'],

      responseParams: ['code'],

      state: 'STATE',

      redirectUri: configurable('redirectUri', function(){
        // A hack that allows redirectUri to be configurable
        // but default to the superclass
        return this._super();
      })
    });

    __exports__["default"] = GithubOauth2;
  });
define("torii/providers/google-oauth2", 
  ["torii/providers/oauth2-code","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /**
     * This class implements authentication against google
     * using the OAuth2 authorization flow in a popup window.
     */

    var Oauth2 = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    var GoogleOauth2 = Oauth2.extend({

      name:    'google-oauth2',
      baseUrl: 'https://accounts.google.com/o/oauth2/auth',

      // additional params that this provider requires
      requiredUrlParams: ['state'],
      optionalUrlParams: ['scope', 'request_visible_actions', 'access_type'],

      requestVisibleActions: configurable('requestVisibleActions', ''),

      accessType: configurable('accessType', ''),

      responseParams: ['code'],

      scope: configurable('scope', 'email'),

      state: configurable('state', 'STATE'),

      redirectUri: configurable('redirectUri',
                                'http://localhost:8000/oauth2callback')
    });

    __exports__["default"] = GoogleOauth2;
  });
define("torii/providers/linked-in-oauth2", 
  ["torii/providers/oauth2-code","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Oauth2 = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    /**
     * This class implements authentication against Linked In
     * using the OAuth2 authorization flow in a popup window.
     *
     * @class LinkedInOauth2
     */
    var LinkedInOauth2 = Oauth2.extend({
      name:       'linked-in-oauth2',
      baseUrl:    'https://www.linkedin.com/uas/oauth2/authorization',

      // additional url params that this provider requires
      requiredUrlParams: ['state'],

      responseParams: ['code'],

      state: 'STATE',

      redirectUri: configurable('redirectUri', function(){
        // A hack that allows redirectUri to be configurable
        // but default to the superclass
        return this._super();
      })

    });

    __exports__["default"] = LinkedInOauth2;
  });
define("torii/providers/oauth1", 
  ["torii/providers/base","torii/configuration","torii/lib/query-string","torii/lib/required-property","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    /*
     * This class implements authentication against an API
     * using the OAuth1.0a request token flow in a popup window.
     */

    var Provider = __dependency1__["default"];
    var configurable = __dependency2__.configurable;
    var QueryString = __dependency3__["default"];
    var requiredProperty = __dependency4__["default"];

    function currentUrl(){
      return [window.location.protocol,
              "//",
              window.location.host,
              window.location.pathname].join('');
    }

    var Oauth1 = Provider.extend({
      name: 'oauth1',

      requestTokenUri: configurable('requestTokenUri'),

      buildRequestTokenUrl: function(){
        var requestTokenUri = this.get('requestTokenUri');
        return requestTokenUri;
      },

      open: function(){
        var name        = this.get('name'),
            url         = this.buildRequestTokenUrl();

        return this.get('popup').open(url, ['code']).then(function(authData){
          authData.provider = name;
          return authData;
        });
      }
    });

    __exports__["default"] = Oauth1;
  });
define("torii/providers/oauth2-bearer", 
  ["torii/providers/oauth2-code","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Provider = __dependency1__["default"];

    var Oauth2Bearer = Provider.extend({
      responseType: 'token',

      /**
       * @method open
       * @return {Promise<object>} If the authorization attempt is a success,
       * the promise will resolve an object containing the following keys:
       *   - authorizationToken: The `token` from the 3rd-party provider
       *   - provider: The name of the provider (i.e., google-oauth2)
       *   - redirectUri: The redirect uri (some server-side exchange flows require this)
       * If there was an error or the user either canceled the authorization or
       * closed the popup window, the promise rejects.
       */
      open: function(){
        var name        = this.get('name'),
            url         = this.buildUrl(),
            redirectUri = this.get('redirectUri'),
            responseParams = this.get('responseParams');

        return this.get('popup').open(url, responseParams).then(function(authData){
          var missingResponseParams = [];

          responseParams.forEach(function(param){
            if (authData[param] === undefined) {
              missingResponseParams.push(param);
            }
          });

          if (missingResponseParams.length){
            throw new Error("The response from the provider is missing " +
                  "these required response params: " + responseParams.join(', '));
          }

          return {
            authorizationToken: authData,
            provider: name,
            redirectUri: redirectUri
          };
        });
      }
    });

    __exports__["default"] = Oauth2Bearer;
  });
define("torii/providers/oauth2-code", 
  ["torii/providers/base","torii/configuration","torii/lib/query-string","torii/lib/required-property","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Provider = __dependency1__["default"];
    var configurable = __dependency2__.configurable;
    var QueryString = __dependency3__["default"];
    var requiredProperty = __dependency4__["default"];

    var computed = Ember.computed;

    function currentUrl(){
      return [window.location.protocol,
              "//",
              window.location.host,
              window.location.pathname].join('');
    }

    /**
     * Implements authorization against an OAuth2 API
     * using the OAuth2 authorization flow in a popup window.
     *
     * Subclasses should extend this class and define the following properties:
     *   - requiredUrlParams: If there are additional required params
     *   - optionalUrlParams: If there are additional optional params
     *   - name: The name used in the configuration `providers` key
     *   - baseUrl: The base url for OAuth2 code-based flow at the 3rd-party
     *
     *   If there are any additional required or optional url params,
     *   include default values for them (if appropriate).
     *
     * @class Oauth2Provider
     */
    var Oauth2 = Provider.extend({
      concatenatedProperties: ['requiredUrlParams','optionalUrlParams'],

      /**
       * The parameters that must be included as query params in the 3rd-party provider's url that we build.
       * These properties are in the format that should be in the URL (i.e.,
       * usually underscored), but they are looked up as camelCased properties
       * on the instance of this provider. For example, if the 'client_id' is
       * a required url param, when building the URL we look up the value of
       * the 'clientId' (camel-cased) property and put it in the URL as
       * 'client_id=' + this.get('clientId')
       * Subclasses can add additional required url params.
       *
       * @property {array} requiredUrlParams
       */
      requiredUrlParams: ['response_type', 'client_id', 'redirect_uri'],

      /**
       * Parameters that may be included in the 3rd-party provider's url that we build.
       * Subclasses can add additional optional url params.
       *
       * @property {array} optionalUrlParams
       */
      optionalUrlParams: ['scope'],

      /**
       * The base url for the 3rd-party provider's OAuth2 flow (example: 'https://github.com/login/oauth/authorize')
       *
       * @property {string} baseUrl
       */
      baseUrl:      requiredProperty(),

      /**
       * The apiKey (sometimes called app id) that identifies the registered application at the 3rd-party provider
       *
       * @property {string} apiKey
       */
      apiKey:       configurable('apiKey'),

      scope:        configurable('scope', null),
      clientId:     configurable('clientId', function () { return this.get('apiKey'); }),

      /**
       * The oauth response type we expect from the third party provider. Hardcoded to 'code' for oauth2-code flows
       * @property {string} responseType
       */
      responseType: 'code',

     /**
      * List of parameters that we expect
      * to see in the query params that the 3rd-party provider appends to
      * our `redirectUri` after the user confirms/denies authorization.
      * If any of these parameters are missing, the OAuth attempt is considered
      * to have failed (usually this is due to the user hitting the 'cancel' button)
      *
      * @property {array} responseParams
      */
      responseParams: requiredProperty(),

      redirectUri: computed(function(){
        return currentUrl();
      }),

      buildQueryString: function(){
        var requiredParams = this.get('requiredUrlParams'),
            optionalParams = this.get('optionalUrlParams');

        var qs = new QueryString(this, requiredParams, optionalParams);
        return qs.toString();
      },

      buildUrl: function(){
        var base = this.get('baseUrl'),
            qs   = this.buildQueryString();

        return [base, qs].join('?');
      },

      /**
       * @method open
       * @return {Promise<object>} If the authorization attempt is a success,
       * the promise will resolve an object containing the following keys:
       *   - authorizationCode: The `code` from the 3rd-party provider
       *   - provider: The name of the provider (i.e., google-oauth2)
       *   - redirectUri: The redirect uri (some server-side exchange flows require this)
       * If there was an error or the user either canceled the authorization or
       * closed the popup window, the promise rejects.
       */
      open: function(){
        var name        = this.get('name'),
            url         = this.buildUrl(),
            redirectUri = this.get('redirectUri'),
            responseParams = this.get('responseParams'),
            responseType = this.get('responseType');

        return this.get('popup').open(url, responseParams).then(function(authData){
          var missingResponseParams = [];

          responseParams.forEach(function(param){
            if (authData[param] === undefined) {
              missingResponseParams.push(param);
            }
          });

          if (missingResponseParams.length){
            throw new Error("The response from the provider is missing " +
                  "these required response params: " + responseParams.join(', '));
          }

          return {
            authorizationCode: authData[responseType],
            provider: name,
            redirectUri: redirectUri
          };
        });
      }
    });

    __exports__["default"] = Oauth2;
  });
define("torii/providers/stripe-connect", 
  ["torii/providers/oauth2-code","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Oauth2 = __dependency1__["default"];
    var configurable = __dependency2__.configurable;

    __exports__["default"] = Oauth2.extend({
      name:       'stripe-connect',
      baseUrl:    'https://connect.stripe.com/oauth/authorize',

      // additional url params that this provider requires
      requiredUrlParams: [],

      responseParams: ['code'],

      scope: 'read_write',

      redirectUri: configurable('redirectUri', function() {
        // A hack that allows redirectUri to be configurable
        // but default to the superclass
        return this._super();
      })
    });
  });
define("torii/providers/twitter-oauth1", 
  ["torii/providers/oauth1","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Oauth1Provider = __dependency1__["default"];

    __exports__["default"] = Oauth1Provider.extend({
      name: 'twitter'
    });
  });
define("torii/redirect-handler", 
  ["./services/popup","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /**
     * RedirectHandler will attempt to find
     * these keys in the URL. If found,
     * this is an indication to Torii that
     * the Ember app has loaded inside a popup
     * and should postMessage this data to window.opener
     */

    var postMessageFixed = __dependency1__.postMessageFixed;
    var readToriiMessage = __dependency1__.readToriiMessage;

    var RedirectHandler = Ember.Object.extend({

      init: function(url){
        this.url = url;
      },

      run: function(){
        var url = this.url;
        return new Ember.RSVP.Promise(function(resolve, reject){
          if (window.opener && window.opener.name === 'torii-opener') {
            postMessageFixed(window.opener, url);
            window.close();
          } else {
            reject('No window.opener');
          }
        });
      }

    });

    RedirectHandler.reopenClass({
      // untested
      handle: function(url){
        var handler = new RedirectHandler(url);
        return handler.run();
      }
    });

    __exports__["default"] = RedirectHandler;
  });
define("torii/services/popup", 
  ["torii/lib/parse-query-string","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ParseQueryString = __dependency1__["default"];

    var on = Ember.on;

    var postMessageFixed;
    var postMessageDomain = window.location.protocol+'//'+window.location.host;
    var postMessagePrefix = "__torii_message:";
    // in IE11 window.attachEvent was removed.
    if (window.attachEvent) {
      postMessageFixed = function postMessageFixed(win, data) {
        win.postMessageWithFix(postMessagePrefix+data, postMessageDomain);
      };
      window.postMessageWithFix = function postMessageWithFix(data, domain) {
        setTimeout(function(){
          window.postMessage(data, domain);
        }, 0);
      };
    } else {
      postMessageFixed = function postMessageFixed(win, data) {
        win.postMessage(postMessagePrefix+data, postMessageDomain);
      };
    }

    __exports__.postMessageFixed = postMessageFixed;

    function stringifyOptions(options){
      var optionsStrings = [];
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          var value;
          switch (options[key]) {
            case true:
              value = '1';
              break;
            case false:
              value = '0';
              break;
            default:
              value = options[key];
          }
          optionsStrings.push(
            key+"="+value
          );
        }
      }
      return optionsStrings.join(',');
    }

    function prepareOptions(options){
      var width = options.width || 500,
          height = options.height || 500;
      return Ember.$.extend({
        left: ((screen.width / 2) - (width / 2)),
        top: ((screen.height / 2) - (height / 2)),
        width: width,
        height: height
      }, options);
    }

    function readToriiMessage(message){
      if (message && typeof message === 'string' && message.indexOf(postMessagePrefix) === 0) {
        return message.slice(postMessagePrefix.length);
      }
    }

    __exports__.readToriiMessage = readToriiMessage;

    function parseMessage(url, keys){
      var parser = new ParseQueryString(url, keys),
          data = parser.parse();
      return data;
    }

    var Popup = Ember.Object.extend(Ember.Evented, {

      // Open a popup window. Returns a promise that resolves or rejects
      // accoring to if the popup is redirected with arguments in the URL.
      //
      // For example, an OAuth2 request:
      //
      // popup.open('http://some-oauth.com', ['code']).then(function(data){
      //   // resolves with data.code, as from http://app.com?code=13124
      // });
      //
      open: function(url, keys, options){
        var service   = this,
            lastPopup = this.popup;

        var oldName = window.name;
        // Is checked by the popup to see if it was opened by Torii
        window.name = 'torii-opener';

        return new Ember.RSVP.Promise(function(resolve, reject){
          if (lastPopup) {
            service.close();
          }

          var optionsString = stringifyOptions(prepareOptions(options || {}));
          service.popup = window.open(url, 'torii_auth', optionsString);

          if (service.popup && !service.popup.closed) {
            service.popup.focus();
          } else {
            reject(new Error(
              'Popup could not open or was closed'));
            return;
          }

          service.one('didClose', function(){
            reject(new Error(
              'Popup was closed or authorization was denied'));
          });

          Ember.$(window).on('message.torii', function(event){
            var message = event.originalEvent.data;
            var toriiMessage = readToriiMessage(message);
            if (toriiMessage) {
              var data = parseMessage(toriiMessage, keys);
              resolve(data);
            }
          });

          service.schedulePolling();

        })["finally"](function(){
          // didClose will reject this same promise, but it has already resolved.
          service.close();
          window.name = oldName;
          Ember.$(window).off('message.torii');
        });
      },

      close: function(){
        if (this.popup) {
          this.popup = null;
          this.trigger('didClose');
        }
      },

      pollPopup: function(){
        if (!this.popup) {
          return;
        }
        if (this.popup.closed) {
          this.trigger('didClose');
        }
      },

      schedulePolling: function(){
        this.polling = Ember.run.later(this, function(){
          this.pollPopup();
          this.schedulePolling();
        }, 35);
      },

      stopPolling: on('didClose', function(){
        Ember.run.cancel(this.polling);
      }),


    });

    __exports__["default"] = Popup;
  });
define("torii/session", 
  ["torii/session/state-machine","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var createStateMachine = __dependency1__["default"];

    var computed = Ember.computed;
    var on = Ember.on;

    function lookupAdapter(container, authenticationType){
      var adapter = container.lookup('torii-adapter:'+authenticationType);
      if (!adapter) {
        adapter = container.lookup('torii-adapter:application');
      }
      return adapter;
    }

    var Session = Ember.ObjectProxy.extend({
      state: null,

      stateMachine: computed(function(){
        return createStateMachine(this);
      }),

      setupStateProxy: on('init', function(){
        var sm    = this.get('stateMachine'),
            proxy = this;
        sm.on('didTransition', function(){
          proxy.set('content', sm.state);
          proxy.set('currentStateName', sm.currentStateName);
        });
      }),

      // Make these properties one-way.
      setUnknownProperty: Ember.K,

      open: function(provider, options){
        var container = this.container,
            torii     = this.get('torii'),
            sm        = this.get('stateMachine');

        return new Ember.RSVP.Promise(function(resolve){
          sm.send('startOpen');
          resolve();
        }).then(function(){
          return torii.open(provider, options);
        }).then(function(authorization){
          var adapter = lookupAdapter(
            container, provider
          );

          return adapter.open(authorization);
        }).then(function(user){
          sm.send('finishOpen', user);
          return user;
        })["catch"](function(error){
          sm.send('failOpen', error);
          return Ember.RSVP.reject(error);
        });
      },

      fetch: function(provider, options){
        var container = this.container,
            sm        = this.get('stateMachine');

        return new Ember.RSVP.Promise(function(resolve){
          sm.send('startFetch');
          resolve();
        }).then(function(){
          var adapter = lookupAdapter(
            container, provider
          );

          return adapter.fetch(options);
        }).then(function(data){
          sm.send('finishFetch', data);
          return;
        })["catch"](function(error){
          sm.send('failFetch', error);
          return Ember.RSVP.reject(error);
        });
      },

      close: function(provider, options){
        var container = this.container,
            sm        = this.get('stateMachine');

        return new Ember.RSVP.Promise(function(resolve){
          sm.send('startClose');
          resolve();
        }).then(function(){
          var adapter = lookupAdapter(container, provider);
          return adapter.close(options);
        }).then(function(){
          sm.send('finishClose');
        })["catch"](function(error){
          sm.send('failClose', error);
          return Ember.RSVP.reject(error);
        });
      }

    });

    __exports__["default"] = Session;
  });
define("torii/session/state-machine", 
  ["torii/lib/state-machine","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var StateMachine = __dependency1__["default"];

    var transitionTo = StateMachine.transitionTo;

    function copyProperties(data, target) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          target[key] = data[key];
        }
      }
    }

    function transitionToClearing(target, propertiesToClear) {
      return function(){
        for (var i;i<propertiesToClear.length;i++) {
          this[propertiesToClear[i]] = null;
        }
        this.transitionTo(target);
      };
    }

    __exports__["default"] = function(session){
      var sm = new StateMachine({
        initialState: 'unauthenticated',

        states: {
          unauthenticated: {
            errorMessage: null,
            isAuthenticated: false,
            // Actions
            startOpen: transitionToClearing('opening', ['errorMessage']),
            startFetch: transitionToClearing('fetching', ['errorMessage'])
          },
          authenticated: {
            // Properties
            currentUser: null,
            isAuthenticated: true,
            startClose: transitionTo('closing')
          },
          opening: {
            isWorking: true,
            isOpening: true,
            // Actions
            finishOpen: function(data){
              copyProperties(data, this.states['authenticated']);
              this.transitionTo('authenticated');
            },
            failOpen: function(errorMessage){
              this.states['unauthenticated'].errorMessage = errorMessage;
              this.transitionTo('unauthenticated');
            }
          },
          fetching: {
            isWorking: true,
            isFetching: true,
            // Actions
            finishFetch: function(data){
              copyProperties(data, this.states['authenticated']);
              this.transitionTo('authenticated');
            },
            failFetch: function(errorMessage){
              this.states['unauthenticated'].errorMessage = errorMessage;
              this.transitionTo('unauthenticated');
            }
          },
          closing: {
            isWorking: true,
            isClosing: true,
            isAuthenticated: true,
            // Actions
            finishClose: function(){
              this.transitionTo('unauthenticated');
            },
            failClose: function(errorMessage){
              this.states['unauthenticated'].errorMessage = errorMessage;
              this.transitionTo('unauthenticated');
            }
          }
        }
      });
      sm.session = session;
      return sm;
    }
  });
define("torii/torii", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function lookupProvider(container, providerName){
      return container.lookup('torii-provider:'+providerName);
    }

    function proxyToProvider(methodName, requireMethod){
      return function(providerName, options){
        var container = this.container;
        var provider = lookupProvider(container, providerName);
        if (!provider) {
          throw new Error("Expected a provider named '"+providerName+"' " +
                          ", did you forget to register it?");
        }

        if (!provider[methodName]) {
          if (requireMethod) {
            throw new Error("Expected provider '"+providerName+"' to define " +
                            "the '"+methodName+"' method.");
          } else {
            return Ember.RSVP.Promise.resolve({});
          }
        }
        return new Ember.RSVP.Promise(function(resolve, reject){
          resolve( provider[methodName](options) );
        });
      };
    }

    /**
     * Torii is an engine for authenticating against various
     * providers. For example, you can open a session with
     * Linked In via Oauth2 and authorization codes by doing
     * the following:
     *
     *     Torii.open('linked-in-oauth2').then(function(authData){
     *       console.log(authData.authorizationCode);
     *     });
     *
     * For traditional authentication flows, you will often use
     * Torii via the Torii.Session API.
     *
     * @class Torii
     */
    var Torii = Ember.Object.extend({

      /**
       * Open an authorization against an API. A promise resolving
       * with an authentication response object is returned. These
       * response objects,  are found in the "torii/authentications"
       * namespace.
       *
       * @method open
       * @param {String} providerName The provider to open
       * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
       */
      open:  proxyToProvider('open', true),

      /**
       * Return a promise which will resolve if the provider has
       * already been opened.
       *
       * @method fetch
       * @param {String} providerName The provider to open
       * @return {Ember.RSVP.Promise} Promise resolving to an authentication object
       */
      fetch:  proxyToProvider('fetch'),

      /**
       * Return a promise which will resolve when the provider has been
       * closed. Closing a provider may not always be a meaningful action,
       * and may be better handled by torii's session management instead.
       *
       * @method close
       * @param {String} providerName The provider to open
       * @return {Ember.RSVP.Promise} Promise resolving when the provider is closed
       */
      close:  proxyToProvider('close')
    });

    __exports__["default"] = Torii;
  });