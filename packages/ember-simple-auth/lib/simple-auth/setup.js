import Configuration from './configuration';
import Session from './session';
import LocalStorage from './stores/local-storage';
import Ephemeral from './stores/ephemeral';

var wildcardToken = '_wildcard_token_';

function extractLocationOrigin(location) {
  if (location === '*'){
      return location;
  }

  location = location.replace('*', wildcardToken);

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

function matchDomain(urlOrigin){
  return function(domain) {
    if (domain.indexOf(wildcardToken) > -1) {
      var domainRegex = new RegExp(domain.replace(wildcardToken , '.+'));
      return urlOrigin.match(domainRegex);
    }

    return domain.indexOf(urlOrigin) > -1;
  };
}

var urlOrigins     = {};
var crossOriginWhitelist;
function shouldAuthorizeRequest(options) {
  if (options.crossDomain === false || crossOriginWhitelist.indexOf('*') > -1) {
    return true;
  }

  var urlOrigin = urlOrigins[options.url] = urlOrigins[options.url] || extractLocationOrigin(options.url);
  return Ember.A(crossOriginWhitelist).any(matchDomain(urlOrigin));
}

function registerFactories(application) {
  application.register('simple-auth-session-store:local-storage', LocalStorage);
  application.register('simple-auth-session-store:ephemeral', Ephemeral);
  application.register('simple-auth-session:main', Session);
}

function ajaxPrefilter(options, originalOptions, jqXHR) {
  if (shouldAuthorizeRequest(options)) {
    jqXHR.__simple_auth_authorized__ = true;
    ajaxPrefilter.authorizer.authorize(jqXHR, options);
  }
}

function ajaxError(event, jqXHR, setting, exception) {
  if (!!jqXHR.__simple_auth_authorized__ && jqXHR.status === 401) {
    ajaxError.session.trigger('authorizationFailed');
  }
}

var didSetupAjaxHooks = false;

/**
  @method setup
  @private
**/
export default function(container, application) {
  application.deferReadiness();
  registerFactories(application);

  var store   = container.lookup(Configuration.store);
  var session = container.lookup(Configuration.session);
  session.set('store', store);
  Ember.A(['controller', 'route', 'component']).forEach(function(component) {
    application.inject(component, Configuration.sessionPropertyName, Configuration.session);
  });

  crossOriginWhitelist = Ember.A(Configuration.crossOriginWhitelist).map(function(origin) {
    return extractLocationOrigin(origin);
  });

  if (!Ember.isEmpty(Configuration.authorizer)) {
    var authorizer = container.lookup(Configuration.authorizer);
    Ember.assert('The configured authorizer "' + Configuration.authorizer + '" could not be found in the container!', !Ember.isEmpty(authorizer));
    authorizer.set('session', session);
    ajaxPrefilter.authorizer = authorizer;
    ajaxError.session = session;

    if (!didSetupAjaxHooks) {
      Ember.$.ajaxPrefilter('+*', ajaxPrefilter);
      Ember.$(document).ajaxError(ajaxError);
      didSetupAjaxHooks = true;
    }
  } else {
    Ember.Logger.info('No authorizer was configured for Ember Simple Auth - specify one if backend requests need to be authorized.');
  }

  var advanceReadiness = function() {
    application.advanceReadiness();
  };
  session.restore().then(advanceReadiness, advanceReadiness);
}
