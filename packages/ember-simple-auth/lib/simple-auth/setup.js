import Configuration from './configuration';
import Session from './session';
import LocalStorage from './stores/local-storage';
import Ephemeral from './stores/ephemeral';

function extractLocationOrigin(location) {
  if (Ember.typeOf(location) === 'string') {
    var link = document.createElement('a');
    link.href = location;
    //IE requires the following line when url is relative.
    //First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
    //Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
    link.href = link.href;
    location = link;
  }
  var port = location.port;
  if (Ember.isEmpty(port)) {
    //need to include the port whether its actually present or not as some versions of IE will always set it
    port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
  }
  return location.protocol + '//' + location.hostname + (port !== '' ? ':' + port : '');
}

var urlOrigins     = {};
var crossOriginWhitelist;
function shouldAuthorizeRequest(options) {
  if (options.crossDomain === false) {
    return true;
  }
  var urlOrigin = urlOrigins[options.url] = urlOrigins[options.url] || extractLocationOrigin(options.url);
  return crossOriginWhitelist.indexOf(urlOrigin) > -1;
}

function registerFactories(container) {
  container.register('simple-auth-session-store:local-storage', LocalStorage);
  container.register('simple-auth-session-store:ephemeral', Ephemeral);
  container.register('simple-auth-session:main', Session);
}

/**
  @method setup
  @private
**/
export default function(container, application) {
  Configuration.load(container);
  application.deferReadiness();
  registerFactories(container);

  var store   = container.lookup(Configuration.store);
  var session = container.lookup(Configuration.session);
  session.setProperties({ store: store, container: container });
  Ember.A(['controller', 'route']).forEach(function(component) {
    container.injection(component, Configuration.sessionPropertyName, Configuration.session);
  });

  crossOriginWhitelist = Ember.A(Configuration.crossOriginWhitelist).map(function(origin) {
    return extractLocationOrigin(origin);
  });

  if (!Ember.isEmpty(Configuration.authorizer)) {
    var authorizer = container.lookup(Configuration.authorizer);
    if (!!authorizer) {
      authorizer.set('session', session);
      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (!authorizer.isDestroyed && shouldAuthorizeRequest(options)) {
          authorizer.authorize(jqXHR, options);
        }
      });
      Ember.$(document).ajaxError(function(event, jqXHR, setting, exception) {
        if (jqXHR.status === 401) {
          session.trigger('authorizationFailed');
        }
      });
    }
  } else {
    Ember.Logger.debug('No authorizer factory was configured for Ember Simple Auth - specify one if backend requests need to be authorized.');
  }

  var advanceReadiness = function() {
    application.advanceReadiness();
  };
  session.restore().then(advanceReadiness, advanceReadiness);
}
