/* globals define FastBoot */
define('fetch', ['exports'], function(exports) {
  var httpRegex = /^https?:\/\//;
  var protocolRelativeRegex = /^\/\//;

  var AbortControllerPolyfill = FastBoot.require(
    'abortcontroller-polyfill/dist/cjs-ponyfill'
  );
  var nodeFetch = FastBoot.require('node-fetch');

  function parseRequest(request) {
    if (request === null) {
      throw new Error('Trying to fetch with relative url but ember-fetch hasn\'t finished loading FastBootInfo, see details at https://github.com/ember-cli/ember-fetch#relative-url');
    }
    // Old Prember version is not sending protocol
    const protocol = request.protocol === 'undefined:' ? 'http:' : request.protocol;
    return [request.get('host'), protocol];
  }

  /**
   * Build the absolute url if it's not, can handle:
   * - protocol-relative URL (//can-be-http-or-https.com/)
   * - path-relative URL (/file/under/root)
   *
   * @returns {string}
   */
  function buildAbsoluteUrl(url) {
    if (protocolRelativeRegex.test(url)) {
      let [host,] = parseRequest(REQUEST);
      url = host + url;
    } else if (!httpRegex.test(url)) {
      let [host, protocol] = parseRequest(REQUEST);
      url = protocol + '//' + host + url;
    }
    return url;
  }

  var REQUEST = null;

  class FastBootRequest extends nodeFetch.Request {
    constructor(input, init) {
      if (typeof input === 'string') {
        input = buildAbsoluteUrl(input);
      } else if (input && input.href) {
        // WHATWG URL or Node.js Url Object
        input = buildAbsoluteUrl(input.href);
      }
      super(input, init);
    }
  }

  /**
   * Isomorphic `fetch` API for both browser and fastboot
   *
   * node-fetch doesn't allow relative URLs, we patch it with Fastboot runtime info.
   * Before instance-initializers Absolute URL is still not allowed, in this case
   * node-fetch will throw error.
   * `FastbootProtocol` and `FastbootHost` are re-set for every instance during its
   * initializers through calling `setupFastboot`.
   *
   * @param {String|Object} input
   * @param {Object} [options]
   */
  exports.default = function fetch(input, options) {
    if (input && input.href) {
      input.url = buildAbsoluteUrl(input.href);
    } else if (typeof input === 'string') {
      input = buildAbsoluteUrl(input);
    }
    return nodeFetch(input, options);
  };
  /**
   * Assign the local REQUEST object for building absolute URLs
   * @private
   */
  exports.setupFastboot = function setupFastboot(fastBootRequest) {
    REQUEST = fastBootRequest;
  }
  exports.Request = FastBootRequest;
  exports.Headers = nodeFetch.Headers;
  exports.Response = nodeFetch.Response;
  exports.AbortController = AbortControllerPolyfill.AbortController;
});
