/* jscs:disable requireDotNotation */
import Ember from 'ember';
import Configuration from '../configuration';

const WILDCARD_TOKEN = '_wildcard_token_';

function extractLocationOrigin(location) {
  if (location === '*') {
    return location;
  }

  location = location.replace('*', WILDCARD_TOKEN);

  if (Ember.typeOf(location) === 'string') {
    let link = document.createElement('a');
    link.href = location;
    // IE requires the following line when url is relative.
    // First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
    // Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
    link.href = link.href;
    location = link;
  }
  let { port } = location;
  if (Ember.isEmpty(port)) {
    // need to include the port whether its actually present or not as some versions of IE will always set it
    port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
  }
  let portString = port !== '' ? `:${port}` : '';
  return `${location.protocol}//${location.hostname}${portString}`;
}

function matchDomain(urlOrigin) {
  return function(domain) {
    if (domain.indexOf(WILDCARD_TOKEN) > -1) {
      let domainRegex = new RegExp(domain.replace(WILDCARD_TOKEN , '.+'));
      return urlOrigin.match(domainRegex);
    }

    return domain.indexOf(urlOrigin) > -1;
  };
}

let urlOrigins     = {};
let crossOriginWhitelist;
function shouldAuthorizeRequest(options) {
  if (options.crossDomain === false || crossOriginWhitelist.indexOf('*') > -1) {
    return true;
  }

  let urlOrigin = urlOrigins[options.url] = urlOrigins[options.url] || extractLocationOrigin(options.url);
  return Ember.A(crossOriginWhitelist).any(matchDomain(urlOrigin));
}

function ajaxPrefilter(options, originalOptions, jqXHR) {
  if (shouldAuthorizeRequest(options)) {
    jqXHR['__simple_auth_authorized__'] = true;
    ajaxPrefilter.authorizer.authorize(jqXHR, options);
  }
}

function ajaxError(event, jqXHR) {
  if (!!jqXHR['__simple_auth_authorized__'] && jqXHR.status === 401) {
    ajaxError.session.trigger('authorizationFailed');
  }
}

let didSetupAjaxHooks = false;

/**
  @method setup
  @private
**/

export default function(instance) {
  const { container } = instance;
  // TODO: setting applicationRootUrl should be done in Configuration.load and should read the value from ENV
  Configuration.base.applicationRootUrl = container.lookup('router:main').get('rootURL') || '/';

  let session = container.lookup('simple-auth-session:main');

  crossOriginWhitelist = Ember.A(Configuration.base.crossOriginWhitelist).map(function(origin) {
    return extractLocationOrigin(origin);
  });

  if (!Ember.isEmpty(Configuration.base.authorizer)) {
    let authorizer = container.lookup(Configuration.base.authorizer);
    Ember.assert(`The configured authorizer "${Configuration.base.authorizer}" could not be found in the container!`, !Ember.isEmpty(authorizer));
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
}
