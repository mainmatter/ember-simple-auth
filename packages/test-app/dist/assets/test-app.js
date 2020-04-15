'use strict';



;define("test-app/adapters/-json-api", ["exports", "@ember-data/adapter/json-api"], function (_exports, _jsonApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _jsonApi.default;
    }
  });
});
;define("test-app/adapters/application", ["exports", "@ember-data/adapter/json-api", "ember-simple-auth/mixins/data-adapter-mixin", "test-app/config/environment"], function (_exports, _jsonApi, _dataAdapterMixin, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /* eslint-disable ember/no-mixins */
  var _default = _jsonApi.default.extend(_dataAdapterMixin.default, {
    host: _environment.default.apiHost,
    headers: Ember.computed('session.{data.authenticated.access_token,isAuthenticated}', function () {
      let headers = {};

      if (this.get('session.isAuthenticated')) {
        headers['Authorization'] = `Bearer ${this.get('session.data.authenticated.access_token')}`;
      }

      return headers;
    })
  });

  _exports.default = _default;
});
;define("test-app/app", ["exports", "test-app/resolver", "ember-load-initializers", "test-app/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default,
    engines: Object.freeze({
      myEngine: {
        dependencies: {
          externalRoutes: {
            login: 'login'
          },
          services: ['session']
        }
      }
    })
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("test-app/authenticators/oauth2-implicit-grant", ["exports", "ember-simple-auth/authenticators/oauth2-implicit-grant"], function (_exports, _oauth2ImplicitGrant) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _oauth2ImplicitGrant.default.extend();

  _exports.default = _default;
});
;define("test-app/authenticators/oauth2", ["exports", "ember-simple-auth/authenticators/oauth2-password-grant", "test-app/config/environment"], function (_exports, _oauth2PasswordGrant, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _oauth2PasswordGrant.default.extend({
    serverTokenEndpoint: `${_environment.default.apiHost}/token`,
    serverTokenRevocationEndpoint: `${_environment.default.apiHost}/revoke`
  });

  _exports.default = _default;
});
;define("test-app/authenticators/torii", ["exports", "ember-simple-auth/authenticators/torii"], function (_exports, _torii) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _torii.default.extend({
    torii: Ember.inject.service(),
    ajax: Ember.inject.service(),

    authenticate() {
      const ajax = this.get('ajax');
      return this._super(...arguments).then(data => {
        return ajax.request('/token', {
          type: 'POST',
          dataType: 'json',
          data: {
            'grant_type': 'facebook_auth_code',
            'auth_code': data.authorizationCode
          }
        }).then(response => {
          return {
            access_token: response.access_token,
            provider: data.provider
          };
        });
      });
    }

  });

  _exports.default = _default;
});
;define("test-app/components/bs-accordion", ["exports", "ember-bootstrap/components/bs-accordion"], function (_exports, _bsAccordion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsAccordion.default;
    }
  });
});
;define("test-app/components/bs-accordion/item", ["exports", "ember-bootstrap/components/bs-accordion/item"], function (_exports, _item) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define("test-app/components/bs-accordion/item/body", ["exports", "ember-bootstrap/components/bs-accordion/item/body"], function (_exports, _body) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
;define("test-app/components/bs-accordion/item/title", ["exports", "ember-bootstrap/components/bs-accordion/item/title"], function (_exports, _title) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
;define("test-app/components/bs-alert", ["exports", "ember-bootstrap/components/bs-alert"], function (_exports, _bsAlert) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsAlert.default;
    }
  });
});
;define("test-app/components/bs-button-group", ["exports", "ember-bootstrap/components/bs-button-group"], function (_exports, _bsButtonGroup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsButtonGroup.default;
    }
  });
});
;define("test-app/components/bs-button-group/button", ["exports", "ember-bootstrap/components/bs-button-group/button"], function (_exports, _button) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
;define("test-app/components/bs-button", ["exports", "ember-bootstrap/components/bs-button"], function (_exports, _bsButton) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsButton.default;
    }
  });
});
;define("test-app/components/bs-carousel", ["exports", "ember-bootstrap/components/bs-carousel"], function (_exports, _bsCarousel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsCarousel.default;
    }
  });
});
;define("test-app/components/bs-carousel/slide", ["exports", "ember-bootstrap/components/bs-carousel/slide"], function (_exports, _slide) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _slide.default;
    }
  });
});
;define("test-app/components/bs-collapse", ["exports", "ember-bootstrap/components/bs-collapse"], function (_exports, _bsCollapse) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsCollapse.default;
    }
  });
});
;define("test-app/components/bs-dropdown", ["exports", "ember-bootstrap/components/bs-dropdown"], function (_exports, _bsDropdown) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsDropdown.default;
    }
  });
});
;define("test-app/components/bs-dropdown/button", ["exports", "ember-bootstrap/components/bs-dropdown/button"], function (_exports, _button) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _button.default;
    }
  });
});
;define("test-app/components/bs-dropdown/menu", ["exports", "ember-bootstrap/components/bs-dropdown/menu"], function (_exports, _menu) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _menu.default;
    }
  });
});
;define("test-app/components/bs-dropdown/menu/divider", ["exports", "ember-bootstrap/components/bs-dropdown/menu/divider"], function (_exports, _divider) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _divider.default;
    }
  });
});
;define("test-app/components/bs-dropdown/menu/item", ["exports", "ember-bootstrap/components/bs-dropdown/menu/item"], function (_exports, _item) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define("test-app/components/bs-dropdown/menu/link-to", ["exports", "ember-bootstrap/components/bs-dropdown/menu/link-to"], function (_exports, _linkTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define("test-app/components/bs-dropdown/toggle", ["exports", "ember-bootstrap/components/bs-dropdown/toggle"], function (_exports, _toggle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
;define("test-app/components/bs-form", ["exports", "ember-bootstrap/components/bs-form"], function (_exports, _bsForm) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsForm.default;
    }
  });
});
;define("test-app/components/bs-form/element", ["exports", "ember-bootstrap/components/bs-form/element"], function (_exports, _element) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define("test-app/components/bs-form/element/control", ["exports", "ember-bootstrap/components/bs-form/element/control"], function (_exports, _control) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _control.default;
    }
  });
});
;define("test-app/components/bs-form/element/control/checkbox", ["exports", "ember-bootstrap/components/bs-form/element/control/checkbox"], function (_exports, _checkbox) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define("test-app/components/bs-form/element/control/input", ["exports", "ember-bootstrap/components/bs-form/element/control/input"], function (_exports, _input) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _input.default;
    }
  });
});
;define("test-app/components/bs-form/element/control/radio", ["exports", "ember-bootstrap/components/bs-form/element/control/radio"], function (_exports, _radio) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _radio.default;
    }
  });
});
;define("test-app/components/bs-form/element/control/textarea", ["exports", "ember-bootstrap/components/bs-form/element/control/textarea"], function (_exports, _textarea) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _textarea.default;
    }
  });
});
;define("test-app/components/bs-form/element/errors", ["exports", "ember-bootstrap/components/bs-form/element/errors"], function (_exports, _errors) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _errors.default;
    }
  });
});
;define("test-app/components/bs-form/element/feedback-icon", ["exports", "ember-bootstrap/components/bs-form/element/feedback-icon"], function (_exports, _feedbackIcon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _feedbackIcon.default;
    }
  });
});
;define("test-app/components/bs-form/element/help-text", ["exports", "ember-bootstrap/components/bs-form/element/help-text"], function (_exports, _helpText) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _helpText.default;
    }
  });
});
;define("test-app/components/bs-form/element/label", ["exports", "ember-bootstrap/components/bs-form/element/label"], function (_exports, _label) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _label.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/horizontal", ["exports", "ember-bootstrap/components/bs-form/element/layout/horizontal"], function (_exports, _horizontal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _horizontal.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/horizontal/checkbox", ["exports", "ember-bootstrap/components/bs-form/element/layout/horizontal/checkbox"], function (_exports, _checkbox) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/inline", ["exports", "ember-bootstrap/components/bs-form/element/layout/inline"], function (_exports, _inline) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _inline.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/inline/checkbox", ["exports", "ember-bootstrap/components/bs-form/element/layout/inline/checkbox"], function (_exports, _checkbox) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/vertical", ["exports", "ember-bootstrap/components/bs-form/element/layout/vertical"], function (_exports, _vertical) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _vertical.default;
    }
  });
});
;define("test-app/components/bs-form/element/layout/vertical/checkbox", ["exports", "ember-bootstrap/components/bs-form/element/layout/vertical/checkbox"], function (_exports, _checkbox) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _checkbox.default;
    }
  });
});
;define("test-app/components/bs-form/group", ["exports", "ember-bootstrap/components/bs-form/group"], function (_exports, _group) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _group.default;
    }
  });
});
;define("test-app/components/bs-modal-simple", ["exports", "ember-bootstrap/components/bs-modal-simple"], function (_exports, _bsModalSimple) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsModalSimple.default;
    }
  });
});
;define("test-app/components/bs-modal", ["exports", "ember-bootstrap/components/bs-modal"], function (_exports, _bsModal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsModal.default;
    }
  });
});
;define("test-app/components/bs-modal/body", ["exports", "ember-bootstrap/components/bs-modal/body"], function (_exports, _body) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _body.default;
    }
  });
});
;define("test-app/components/bs-modal/dialog", ["exports", "ember-bootstrap/components/bs-modal/dialog"], function (_exports, _dialog) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _dialog.default;
    }
  });
});
;define("test-app/components/bs-modal/footer", ["exports", "ember-bootstrap/components/bs-modal/footer"], function (_exports, _footer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _footer.default;
    }
  });
});
;define("test-app/components/bs-modal/header", ["exports", "ember-bootstrap/components/bs-modal/header"], function (_exports, _header) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _header.default;
    }
  });
});
;define("test-app/components/bs-modal/header/close", ["exports", "ember-bootstrap/components/bs-modal/header/close"], function (_exports, _close) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _close.default;
    }
  });
});
;define("test-app/components/bs-modal/header/title", ["exports", "ember-bootstrap/components/bs-modal/header/title"], function (_exports, _title) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _title.default;
    }
  });
});
;define("test-app/components/bs-nav", ["exports", "ember-bootstrap/components/bs-nav"], function (_exports, _bsNav) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsNav.default;
    }
  });
});
;define("test-app/components/bs-nav/item", ["exports", "ember-bootstrap/components/bs-nav/item"], function (_exports, _item) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _item.default;
    }
  });
});
;define("test-app/components/bs-nav/link-to", ["exports", "ember-bootstrap/components/bs-nav/link-to"], function (_exports, _linkTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define("test-app/components/bs-navbar", ["exports", "ember-bootstrap/components/bs-navbar"], function (_exports, _bsNavbar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsNavbar.default;
    }
  });
});
;define("test-app/components/bs-navbar/content", ["exports", "ember-bootstrap/components/bs-navbar/content"], function (_exports, _content) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
;define("test-app/components/bs-navbar/link-to", ["exports", "ember-bootstrap/components/bs-navbar/link-to"], function (_exports, _linkTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _linkTo.default;
    }
  });
});
;define("test-app/components/bs-navbar/nav", ["exports", "ember-bootstrap/components/bs-navbar/nav"], function (_exports, _nav) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _nav.default;
    }
  });
});
;define("test-app/components/bs-navbar/toggle", ["exports", "ember-bootstrap/components/bs-navbar/toggle"], function (_exports, _toggle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _toggle.default;
    }
  });
});
;define("test-app/components/bs-popover", ["exports", "ember-bootstrap/components/bs-popover"], function (_exports, _bsPopover) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsPopover.default;
    }
  });
});
;define("test-app/components/bs-popover/element", ["exports", "ember-bootstrap/components/bs-popover/element"], function (_exports, _element) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define("test-app/components/bs-progress", ["exports", "ember-bootstrap/components/bs-progress"], function (_exports, _bsProgress) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsProgress.default;
    }
  });
});
;define("test-app/components/bs-progress/bar", ["exports", "ember-bootstrap/components/bs-progress/bar"], function (_exports, _bar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bar.default;
    }
  });
});
;define("test-app/components/bs-tab", ["exports", "ember-bootstrap/components/bs-tab"], function (_exports, _bsTab) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsTab.default;
    }
  });
});
;define("test-app/components/bs-tab/pane", ["exports", "ember-bootstrap/components/bs-tab/pane"], function (_exports, _pane) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _pane.default;
    }
  });
});
;define("test-app/components/bs-tooltip", ["exports", "ember-bootstrap/components/bs-tooltip"], function (_exports, _bsTooltip) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsTooltip.default;
    }
  });
});
;define("test-app/components/bs-tooltip/element", ["exports", "ember-bootstrap/components/bs-tooltip/element"], function (_exports, _element) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _element.default;
    }
  });
});
;define("test-app/components/ember-popper-targeting-parent", ["exports", "ember-popper/components/ember-popper-targeting-parent"], function (_exports, _emberPopperTargetingParent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
;define("test-app/components/ember-popper", ["exports", "ember-popper/components/ember-popper"], function (_exports, _emberPopper) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
;define("test-app/components/link-to-external", ["exports", "ember-engines/components/link-to-external"], function (_exports, _linkToExternal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _linkToExternal.default;
    }
  });
});
;define("test-app/components/login-form", ["exports", "test-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    session: Ember.inject.service('session'),
    actions: {
      async authenticateWithOAuth2() {
        try {
          let {
            identification,
            password
          } = this;
          await this.get('session').authenticate('authenticator:oauth2', identification, password);

          if (this.rememberMe) {
            this.get('session').set('store.cookieExpirationTime', 60 * 60 * 24 * 14);
          }
        } catch (reason) {
          this.set('errorMessage', reason.error);
        }
      },

      authenticateWithFacebook() {
        this.get('session').authenticate('authenticator:torii', 'facebook');
      },

      authenticateWithGoogleImplicitGrant() {
        let clientId = _environment.default.googleClientID;
        let redirectURI = `${window.location.origin}/callback`;
        let responseType = `token`;
        let scope = `email`;
        window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?` + `client_id=${clientId}` + `&redirect_uri=${redirectURI}` + `&response_type=${responseType}` + `&scope=${scope}`);
      },

      updateIdentification(e) {
        this.set('identification', e.target.value);
      },

      updatePassword(e) {
        this.set('password', e.target.value);
      },

      updateRememberMe(e) {
        this.set('rememberMe', e.target.checked);
      }

    }
  });

  _exports.default = _default;
});
;define("test-app/components/main-navigation", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),
    actions: {
      logout() {
        this.get('session').invalidate();
      }

    }
  });

  _exports.default = _default;
});
;define("test-app/components/torii-iframe-placeholder", ["exports", "torii/components/torii-iframe-placeholder"], function (_exports, _toriiIframePlaceholder) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _toriiIframePlaceholder.default;
  _exports.default = _default;
});
;define("test-app/config/asset-manifest", ["exports", "require", "test-app/config/environment"], function (_exports, _require, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const modulePrefix = _environment.default.modulePrefix;
  const metaName = `${modulePrefix}/config/asset-manifest`;
  const nodeName = `${modulePrefix}/config/node-asset-manifest`;
  let config = {};

  try {
    // If we have a Node version of the asset manifest, use that for FastBoot and
    // similar environments.
    if (_require.default.has(nodeName)) {
      config = (0, _require.default)(nodeName).default; // eslint-disable-line
    } else {
      const rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
      config = JSON.parse(unescape(rawConfig));
    }
  } catch (err) {
    throw new Error('Failed to load asset manifest. For browser environments, verify the meta tag with name "' + metaName + '" is present. For non-browser environments, verify that you included the node-asset-manifest module.');
  }

  var _default = config;
  _exports.default = _default;
});
;define("test-app/controllers/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    actions: {
      transitionToLoginRoute() {
        this.transitionToRoute('login');
      }

    }
  });

  _exports.default = _default;
});
;define("test-app/controllers/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    session: Ember.inject.service()
  });

  _exports.default = _default;
});
;define("test-app/data-adapter", ["exports", "@ember-data/debug"], function (_exports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _debug.default;
    }
  });
});
;define("test-app/helpers/bs-contains", ["exports", "ember-bootstrap/helpers/bs-contains"], function (_exports, _bsContains) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsContains.default;
    }
  });
  Object.defineProperty(_exports, "bsContains", {
    enumerable: true,
    get: function () {
      return _bsContains.bsContains;
    }
  });
});
;define("test-app/helpers/bs-eq", ["exports", "ember-bootstrap/helpers/bs-eq"], function (_exports, _bsEq) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _bsEq.default;
    }
  });
  Object.defineProperty(_exports, "eq", {
    enumerable: true,
    get: function () {
      return _bsEq.eq;
    }
  });
});
;define("test-app/helpers/cancel-all", ["exports", "ember-concurrency/helpers/cancel-all"], function (_exports, _cancelAll) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _cancelAll.default;
    }
  });
});
;define("test-app/helpers/on-document", ["exports", "ember-on-helper/helpers/on-document"], function (_exports, _onDocument) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _onDocument.default;
    }
  });
});
;define("test-app/helpers/on-window", ["exports", "ember-on-helper/helpers/on-window"], function (_exports, _onWindow) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _onWindow.default;
    }
  });
});
;define("test-app/helpers/on", ["exports", "ember-on-helper/helpers/on"], function (_exports, _on) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _on.default;
    }
  });
});
;define("test-app/helpers/perform", ["exports", "ember-concurrency/helpers/perform"], function (_exports, _perform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _perform.default;
    }
  });
});
;define("test-app/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("test-app/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("test-app/helpers/task", ["exports", "ember-concurrency/helpers/task"], function (_exports, _task) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _task.default;
    }
  });
});
;define("test-app/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("test-app/initializers/ember-concurrency", ["exports", "ember-concurrency/initializers/ember-concurrency"], function (_exports, _emberConcurrency) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberConcurrency.default;
    }
  });
});
;define("test-app/initializers/ember-data-data-adapter", ["exports", "@ember-data/debug/setup"], function (_exports, _setup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _setup.default;
    }
  });
});
;define("test-app/initializers/ember-data", ["exports", "ember-data", "ember-data/setup-container"], function (_exports, _emberData, _setupContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
    This code initializes EmberData in an Ember application.
  
    It ensures that the `store` service is automatically injected
    as the `store` property on all routes and controllers.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("test-app/initializers/ember-simple-auth", ["exports", "test-app/config/environment", "ember-simple-auth/configuration", "ember-simple-auth/initializers/setup-session", "ember-simple-auth/initializers/setup-session-service", "ember-simple-auth/initializers/setup-session-restoration"], function (_exports, _environment, _configuration, _setupSession, _setupSessionService, _setupSessionRestoration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-simple-auth',

    initialize(registry) {
      const config = _environment.default['ember-simple-auth'] || {};
      config.rootURL = _environment.default.rootURL || _environment.default.baseURL;

      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
      (0, _setupSessionRestoration.default)(registry);
    }

  };
  _exports.default = _default;
});
;define("test-app/initializers/engines", ["exports", "ember-engines/initializers/engines"], function (_exports, _engines) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _engines.default;
    }
  });
  Object.defineProperty(_exports, "initialize", {
    enumerable: true,
    get: function () {
      return _engines.initialize;
    }
  });
});
;define("test-app/initializers/export-application-global", ["exports", "test-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("test-app/initializers/initialize-torii-callback", ["exports", "test-app/config/environment", "torii/redirect-handler"], function (_exports, _environment, _redirectHandler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'torii-callback',
    before: 'torii',

    initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }

      if (_environment.default.torii && _environment.default.torii.disableRedirectInitializer) {
        return;
      }

      application.deferReadiness();

      _redirectHandler.default.handle(window).catch(function () {
        application.advanceReadiness();
      });
    }

  };
  _exports.default = _default;
});
;define("test-app/initializers/initialize-torii-session", ["exports", "torii/bootstrap/session", "torii/configuration"], function (_exports, _session, _configuration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'torii-session',
    after: 'torii',

    initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }

      const configuration = (0, _configuration.getConfiguration)();

      if (!configuration.sessionServiceName) {
        return;
      }

      (0, _session.default)(application, configuration.sessionServiceName);
      var sessionFactoryName = 'service:' + configuration.sessionServiceName;
      application.inject('adapter', configuration.sessionServiceName, sessionFactoryName);
    }

  };
  _exports.default = _default;
});
;define("test-app/initializers/initialize-torii", ["exports", "torii/bootstrap/torii", "torii/configuration", "test-app/config/environment"], function (_exports, _torii, _configuration, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var initializer = {
    name: 'torii',

    initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }

      (0, _configuration.configure)(_environment.default.torii || {});
      (0, _torii.default)(application);
      application.inject('route', 'torii', 'service:torii');
    }

  };
  var _default = initializer;
  _exports.default = _default;
});
;define("test-app/initializers/load-bootstrap-config", ["exports", "test-app/config/environment", "ember-bootstrap/config"], function (_exports, _environment, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize()
  /* container, application */
  {
    _config.default.load(_environment.default['ember-bootstrap'] || {});
  }

  var _default = {
    name: 'load-bootstrap-config',
    initialize
  };
  _exports.default = _default;
});
;define("test-app/instance-initializers/clear-double-boot", ["exports", "ember-cli-fastboot/instance-initializers/clear-double-boot"], function (_exports, _clearDoubleBoot) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _clearDoubleBoot.default;
    }
  });
});
;define("test-app/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("test-app/instance-initializers/ember-simple-auth", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // This is only needed for backwards compatibility and will be removed in the
  // next major release of ember-simple-auth. Unfortunately, there is no way to
  // deprecate this without hooking into Ember's internals…
  var _default = {
    name: 'ember-simple-auth',

    initialize() {}

  };
  _exports.default = _default;
});
;define("test-app/instance-initializers/load-asset-manifest", ["exports", "test-app/config/asset-manifest"], function (_exports, _assetManifest) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  /**
   * Initializes the AssetLoader service with a generated asset-manifest.
   */
  function initialize(instance) {
    const service = instance.lookup('service:asset-loader');
    service.pushManifest(_assetManifest.default);
  }

  var _default = {
    name: 'load-asset-manifest',
    initialize
  };
  _exports.default = _default;
});
;define("test-app/instance-initializers/setup-routes", ["exports", "torii/bootstrap/routing", "torii/configuration", "torii/compat/get-router-instance", "torii/compat/get-router-lib", "torii/router-dsl-ext"], function (_exports, _routing, _configuration, _getRouterInstance, _getRouterLib, _routerDslExt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'torii-setup-routes',

    initialize(applicationInstance
    /*, registry */
    ) {
      const configuration = (0, _configuration.getConfiguration)();

      if (!configuration.sessionServiceName) {
        return;
      }

      let router = (0, _getRouterInstance.default)(applicationInstance);

      var setupRoutes = function () {
        let routerLib = (0, _getRouterLib.default)(router);
        var authenticatedRoutes = routerLib.authenticatedRoutes;
        var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);

        if (hasAuthenticatedRoutes) {
          (0, _routing.default)(applicationInstance, authenticatedRoutes);
        }

        router.off('willTransition', setupRoutes);
      };

      router.on('willTransition', setupRoutes);
    }

  };
  _exports.default = _default;
});
;define("test-app/instance-initializers/walk-providers", ["exports", "torii/lib/container-utils", "torii/configuration"], function (_exports, _containerUtils, _configuration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'torii-walk-providers',

    initialize(applicationInstance) {
      let configuration = (0, _configuration.getConfiguration)(); // Walk all configured providers and eagerly instantiate
      // them. This gives providers with initialization side effects
      // like facebook-connect a chance to load up assets.

      for (var key in configuration.providers) {
        if (configuration.providers.hasOwnProperty(key)) {
          (0, _containerUtils.lookup)(applicationInstance, 'torii-provider:' + key);
        }
      }
    }

  };
  _exports.default = _default;
});
;define("test-app/locations/none", ["exports", "ember-cli-fastboot/locations/none"], function (_exports, _none) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _none.default;
    }
  });
});
;define("test-app/models/account", ["exports", "@ember-data/model"], function (_exports, _model) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _model.default.extend({
    login: (0, _model.attr)('string'),
    name: (0, _model.attr)('string')
  });

  _exports.default = _default;
});
;define("test-app/models/post", ["exports", "@ember-data/model"], function (_exports, _model) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _model.default.extend({
    title: (0, _model.attr)('string'),
    body: (0, _model.attr)('string')
  });

  _exports.default = _default;
});
;define("test-app/modifiers/focus-trap", ["exports", "ember-focus-trap/modifiers/focus-trap"], function (_exports, _focusTrap) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _focusTrap.default;
    }
  });
});
;define("test-app/modifiers/ref", ["exports", "ember-ref-modifier/modifiers/ref"], function (_exports, _ref) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ref.default;
    }
  });
});
;define("test-app/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("test-app/router", ["exports", "test-app/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('login');
    this.route('protected');
    this.route('auth-error');
    this.route('callback');
    this.mount('my-engine', {
      as: 'engine',
      path: '/engine'
    });
  });
  var _default = Router;
  _exports.default = _default;
});
;define("test-app/routes/application", ["exports", "ember-simple-auth/mixins/application-route-mixin"], function (_exports, _applicationRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_applicationRouteMixin.default, {
    sessionAccount: Ember.inject.service('session-account'),

    beforeModel() {
      return this._loadCurrentUser();
    },

    sessionAuthenticated() {
      this._super(...arguments);

      this._loadCurrentUser();
    },

    _loadCurrentUser() {
      return this.get('sessionAccount').loadCurrentUser().catch(() => this.get('session').invalidate());
    }

  });

  _exports.default = _default;
});
;define("test-app/routes/auth-error", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    model() {
      return this.get('store').find('post', 3);
    }

  });

  _exports.default = _default;
});
;define("test-app/routes/callback", ["exports", "ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin"], function (_exports, _oauth2ImplicitGrantCallbackRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_oauth2ImplicitGrantCallbackRouteMixin.default, {
    authenticator: 'authenticator:oauth2-implicit-grant'
  });

  _exports.default = _default;
});
;define("test-app/routes/login", ["exports", "ember-simple-auth/mixins/unauthenticated-route-mixin"], function (_exports, _unauthenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_unauthenticatedRouteMixin.default);

  _exports.default = _default;
});
;define("test-app/routes/protected", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    model() {
      return this.get('store').findAll('post');
    }

  });

  _exports.default = _default;
});
;define("test-app/serializers/-default", ["exports", "@ember-data/serializer/json"], function (_exports, _json) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _json.default;
    }
  });
});
;define("test-app/serializers/-json-api", ["exports", "@ember-data/serializer/json-api"], function (_exports, _jsonApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _jsonApi.default;
    }
  });
});
;define("test-app/serializers/-rest", ["exports", "@ember-data/serializer/rest"], function (_exports, _rest) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _rest.default;
    }
  });
});
;define("test-app/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("test-app/services/asset-loader", ["exports", "ember-asset-loader/services/asset-loader"], function (_exports, _assetLoader) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _assetLoader.default;
    }
  });
});
;define("test-app/services/cookies", ["exports", "ember-cookies/services/cookies"], function (_exports, _cookies) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _cookies.default;
  _exports.default = _default;
});
;define("test-app/services/fastboot", ["exports", "ember-cli-fastboot/services/fastboot"], function (_exports, _fastboot) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _fastboot.default;
    }
  });
});
;define("test-app/services/popup", ["exports", "torii/services/popup"], function (_exports, _popup) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _popup.default;
    }
  });
});
;define("test-app/services/session-account", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Service.extend({
    session: Ember.inject.service('session'),
    store: Ember.inject.service(),

    async loadCurrentUser() {
      let accountId = this.get('session.data.authenticated.account_id');

      if (accountId) {
        let account = await this.get('store').find('account', accountId);
        this.set('account', account);
      }
    }

  });

  _exports.default = _default;
});
;define("test-app/services/session", ["exports", "ember-simple-auth/services/session"], function (_exports, _session) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _session.default;
  _exports.default = _default;
});
;define("test-app/services/store", ["exports", "ember-data/store"], function (_exports, _store) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _store.default;
    }
  });
});
;define("test-app/services/torii-session", ["exports", "torii/services/torii-session"], function (_exports, _toriiSession) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _toriiSession.default;
    }
  });
});
;define("test-app/services/torii", ["exports", "torii/services/torii"], function (_exports, _torii) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _torii.default;
    }
  });
});
;define("test-app/session-stores/application", ["exports", "ember-simple-auth/session-stores/cookie"], function (_exports, _cookie) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _cookie.default.extend();

  _exports.default = _default;
});
;define("test-app/templates/application-loading", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "OvtFWPQb",
    "block": "{\"symbols\":[],\"statements\":[[9,\"div\",true],[12,\"class\",\"loading\",null],[10],[1,1,0,0,\"\\n  Loading…\\n\"],[11],[1,1,0,0,\"\\n\"]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "test-app/templates/application-loading.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "8Yr1f5w/",
    "block": "{\"symbols\":[],\"statements\":[[1,0,0,0,[31,2,15,[27,[26,1,\"CallHead\"],[]],null,[[\"onLogin\"],[[31,27,6,[27,[26,0,\"CallHead\"],[]],[[27,[24,0],[]],\"transitionToLoginRoute\"],null]]]]],[1,1,0,0,\"\\n\"],[9,\"div\",true],[12,\"class\",\"container mt-4\",null],[10],[1,1,0,0,\"\\n  \"],[1,0,0,0,[31,0,0,[27,[26,3,\"CallHead\"],[]],[[31,0,0,[27,[26,2,\"CallHead\"],[]],null,null]],null]],[1,1,0,0,\"\\n\"],[11]],\"hasEval\":false,\"upvars\":[\"action\",\"main-navigation\",\"-outlet\",\"component\"]}",
    "meta": {
      "moduleName": "test-app/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/components/ember-popper-targeting-parent", ["exports", "ember-popper/templates/components/ember-popper-targeting-parent"], function (_exports, _emberPopperTargetingParent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberPopperTargetingParent.default;
    }
  });
});
;define("test-app/templates/components/ember-popper", ["exports", "ember-popper/templates/components/ember-popper"], function (_exports, _emberPopper) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberPopper.default;
    }
  });
});
;define("test-app/templates/components/login-form", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "cviAZUXV",
    "block": "{\"symbols\":[],\"statements\":[[9,\"a\",false],[23,\"class\",\"btn btn-primary\",null],[23,\"href\",\"#\",null],[23,\"role\",\"button\",null],[3,0,0,[27,[26,1,\"ModifierHead\"],[]],[[27,[24,0],[]],\"authenticateWithFacebook\"],null],[10],[1,1,0,0,\"Login with Facebook\"],[11],[1,1,0,0,\"\\n\"],[9,\"hr\",true],[10],[11],[1,1,0,0,\"\\n\"],[9,\"a\",false],[23,\"class\",\"btn btn-primary\",null],[23,\"href\",\"#\",null],[23,\"role\",\"button\",null],[3,0,0,[27,[26,1,\"ModifierHead\"],[]],[[27,[24,0],[]],\"authenticateWithGoogleImplicitGrant\"],null],[10],[1,1,0,0,\"Login with Google (Implicit Grant)\"],[11],[1,1,0,0,\"\\n\"],[9,\"hr\",true],[10],[11],[1,1,0,0,\"\\n\"],[9,\"p\",true],[10],[1,1,0,0,\"or login with OAuth 2.0 \"],[9,\"em\",true],[10],[1,1,0,0,\"Resource Owner Password Credentials\"],[11],[1,1,0,0,\":\"],[11],[1,1,0,0,\"\\n\"],[9,\"form\",false],[3,0,0,[27,[26,1,\"ModifierHead\"],[]],[[27,[24,0],[]],\"authenticateWithOAuth2\"],[[\"on\"],[\"submit\"]]],[10],[1,1,0,0,\"\\n  \"],[9,\"div\",true],[12,\"class\",\"form-group\",null],[10],[1,1,0,0,\"\\n    \"],[9,\"label\",true],[12,\"for\",\"identification\",null],[10],[1,1,0,0,\"Login\"],[11],[1,1,0,0,\"\\n    \"],[9,\"input\",true],[12,\"placeholder\",\"Enter Login\",null],[12,\"class\",\"form-control\",null],[13,\"onchange\",[31,665,6,[27,[26,1,\"CallHead\"],[]],[[27,[24,0],[]],\"updateIdentification\"],null],null],[13,\"value\",[27,[24,0],[\"identification\"]],null],[12,\"type\",\"text\",null],[10],[11],[1,1,0,0,\"\\n  \"],[11],[1,1,0,0,\"\\n  \"],[9,\"div\",true],[12,\"class\",\"form-group\",null],[10],[1,1,0,0,\"\\n    \"],[9,\"label\",true],[12,\"for\",\"password\",null],[10],[1,1,0,0,\"Password\"],[11],[1,1,0,0,\"\\n    \"],[9,\"input\",true],[12,\"placeholder\",\"Enter Password\",null],[12,\"class\",\"form-control\",null],[13,\"onchange\",[31,897,6,[27,[26,1,\"CallHead\"],[]],[[27,[24,0],[]],\"updatePassword\"],null],null],[13,\"value\",[27,[24,0],[\"password\"]],null],[12,\"type\",\"password\",null],[10],[11],[1,1,0,0,\"\\n  \"],[11],[1,1,0,0,\"\\n  \"],[9,\"div\",true],[12,\"class\",\"form-group form-check\",null],[10],[1,1,0,0,\"\\n    \"],[9,\"input\",true],[12,\"class\",\"form-check-input\",null],[12,\"id\",\"rememberMe\",null],[13,\"onchange\",[31,1076,6,[27,[26,1,\"CallHead\"],[]],[[27,[24,0],[]],\"updateRememberMe\"],null],null],[13,\"checked\",[27,[24,0],[\"rememberMe\"]],null],[12,\"type\",\"checkbox\",null],[10],[11],[1,1,0,0,\"\\n    \"],[9,\"label\",true],[12,\"for\",\"rememberMe\",null],[12,\"class\",\"form-check-label\",null],[10],[1,1,0,0,\"\\n      Remember me\\n    \"],[11],[1,1,0,0,\"\\n  \"],[11],[1,1,0,0,\"\\n  \"],[9,\"button\",true],[12,\"class\",\"btn btn-primary\",null],[12,\"type\",\"submit\",null],[10],[1,1,0,0,\"Login\"],[11],[1,1,0,0,\"\\n\"],[11],[1,1,0,0,\"\\n\"],[5,[27,[26,2,\"BlockHead\"],[]],[[27,[26,0,\"Expression\"],[]]],null,[[\"default\"],[{\"statements\":[[1,1,0,0,\"  \"],[9,\"div\",true],[12,\"class\",\"alert alert-danger\",null],[10],[1,1,0,0,\"\\n    \"],[9,\"p\",true],[10],[1,1,0,0,\"\\n      \"],[9,\"strong\",true],[10],[1,1,0,0,\"Login failed:\"],[11],[1,1,0,0,\" \"],[9,\"code\",true],[10],[1,0,0,0,[27,[26,0,\"AppendSingleId\"],[]]],[11],[1,1,0,0,\"\\n    \"],[11],[1,1,0,0,\"\\n    \"],[9,\"p\",true],[10],[1,1,0,0,\"\\n      Documentation of the error codes can be found in the \"],[9,\"a\",true],[12,\"href\",\"http://tools.ietf.org/html/rfc6749#section-5.2\",null],[12,\"title\",\"RFC 6749 - Error Response\",null],[10],[1,1,0,0,\"Error Response section of RFC 6749\"],[11],[1,1,0,0,\".\\n    \"],[11],[1,1,0,0,\"\\n  \"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]]],\"hasEval\":false,\"upvars\":[\"errorMessage\",\"action\",\"if\"]}",
    "meta": {
      "moduleName": "test-app/templates/components/login-form.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/components/main-navigation", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "dxvpQll7",
    "block": "{\"symbols\":[],\"statements\":[[9,\"nav\",true],[12,\"class\",\"navbar navbar-expand-lg navbar-light bg-light fixed-top\",null],[10],[1,1,0,0,\"\\n\"],[5,[27,[26,4,\"BlockHead\"],[]],null,[[\"classNames\",\"route\"],[\"navbar-brand\",\"index\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"    Home\\n\"]],\"parameters\":[]}]]],[1,1,0,0,\"  \"],[9,\"ul\",true],[12,\"class\",\"navbar-nav mr-auto\",null],[10],[1,1,0,0,\"\\n\"],[5,[27,[26,4,\"BlockHead\"],[]],null,[[\"tagName\",\"class\",\"route\"],[\"li\",\"nav-item\",\"protected\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"      \"],[9,\"a\",true],[12,\"class\",\"nav-link\",null],[12,\"href\",\"#\",null],[10],[1,1,0,0,\"Protected Page\"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[5,[27,[26,4,\"BlockHead\"],[]],null,[[\"tagName\",\"route\"],[\"li\",\"engine.index\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"      \"],[9,\"a\",true],[12,\"class\",\"nav-link\",null],[12,\"href\",\"#\",null],[10],[1,1,0,0,\"Engine\"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[5,[27,[26,4,\"BlockHead\"],[]],null,[[\"tagName\",\"class\",\"route\"],[\"li\",\"nav-item\",\"auth-error\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"      \"],[9,\"a\",true],[12,\"class\",\"nav-link\",null],[12,\"href\",\"#\",null],[10],[1,1,0,0,\"Auth Error Page\"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[1,1,0,0,\"  \"],[11],[1,1,0,0,\"\\n  \"],[9,\"form\",true],[12,\"class\",\"form-inline\",null],[10],[1,1,0,0,\"\\n\"],[5,[27,[26,3,\"BlockHead\"],[]],[[27,[26,5,\"Expression\"],[\"isAuthenticated\"]]],null,[[\"default\",\"else\"],[{\"statements\":[[5,[27,[26,3,\"BlockHead\"],[]],[[27,[26,2,\"Expression\"],[\"account\"]]],null,[[\"default\"],[{\"statements\":[[1,1,0,0,\"        \"],[9,\"span\",true],[12,\"class\",\"navbar-text mr-3\",null],[10],[1,1,0,0,\"Signed in as \"],[1,0,0,0,[27,[26,2,\"Expression\"],[\"account\",\"name\"]]],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[1,1,0,0,\"      \"],[9,\"a\",false],[23,\"class\",\"btn btn-danger\",null],[23,\"href\",\"#\",null],[23,\"role\",\"button\",null],[3,0,0,[27,[26,1,\"ModifierHead\"],[]],[[27,[24,0],[]],\"logout\"],null],[10],[1,1,0,0,\"Logout\"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[1,1,0,0,\"      \"],[9,\"a\",false],[23,\"class\",\"btn btn-success\",null],[23,\"href\",\"#\",null],[23,\"role\",\"button\",null],[3,0,0,[27,[26,1,\"ModifierHead\"],[]],[[27,[24,0],[]],[27,[26,0,\"Expression\"],[]]],null],[10],[1,1,0,0,\"Login\"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[1,1,0,0,\"  \"],[11],[1,1,0,0,\"\\n\"],[11]],\"hasEval\":false,\"upvars\":[\"onLogin\",\"action\",\"sessionAccount\",\"if\",\"link-to\",\"session\"]}",
    "meta": {
      "moduleName": "test-app/templates/components/main-navigation.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "VsLErH1u",
    "block": "{\"symbols\":[],\"statements\":[[9,\"h1\",true],[10],[1,1,0,0,\"Ember Simple Auth example app\"],[11],[1,1,0,0,\"\\n\"],[5,[27,[26,2,\"BlockHead\"],[]],[[27,[26,1,\"Expression\"],[\"isAuthenticated\"]]],null,[[\"default\"],[{\"statements\":[[1,1,0,0,\"  \"],[9,\"div\",true],[12,\"class\",\"alert alert-info\",null],[12,\"role\",\"alert\",null],[10],[1,1,0,0,\"\\n    You can \"],[5,[27,[26,0,\"BlockHead\"],[]],null,[[\"classNames\",\"route\"],[\"alert-link\",\"login\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"log in\"]],\"parameters\":[]}]]],[1,1,0,0,\" with login \"],[9,\"code\",true],[10],[1,1,0,0,\"letme\"],[11],[1,1,0,0,\" and password \"],[9,\"code\",true],[10],[1,1,0,0,\"in\"],[11],[1,1,0,0,\".\\n  \"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[]}]]],[9,\"div\",true],[12,\"class\",\"alert alert-info\",null],[12,\"role\",\"alert\",null],[10],[1,1,0,0,\"\\n  The test app provides two routes - the \"],[5,[27,[26,0,\"BlockHead\"],[]],null,[[\"route\"],[\"protected\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"Protected Page\"]],\"parameters\":[]}]]],[1,1,0,0,\" that loads some Ember Data models where the API validates that the request is authorized and the \"],[5,[27,[26,0,\"BlockHead\"],[]],null,[[\"route\"],[\"auth-error\"]],[[\"default\"],[{\"statements\":[[1,1,0,0,\"Auth Error Page\"]],\"parameters\":[]}]]],[1,1,0,0,\" that simulates an authorization error (it loads Ember Data models as well but will always receive a 401 response) and will result in the session being invalidated.\\n\"],[11]],\"hasEval\":false,\"upvars\":[\"link-to\",\"session\",\"unless\"]}",
    "meta": {
      "moduleName": "test-app/templates/index.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/login", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "TXgX67SP",
    "block": "{\"symbols\":[],\"statements\":[[9,\"h1\",true],[10],[1,1,0,0,\"Login\"],[11],[1,1,0,0,\"\\n\"],[1,0,0,0,[27,[26,0,\"AppendSingleId\"],[]]]],\"hasEval\":false,\"upvars\":[\"login-form\"]}",
    "meta": {
      "moduleName": "test-app/templates/login.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/templates/protected", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "EIxUw/Qb",
    "block": "{\"symbols\":[\"post\"],\"statements\":[[9,\"h1\",true],[10],[1,1,0,0,\"Protected Page\"],[11],[1,1,0,0,\"\\n\"],[9,\"div\",true],[12,\"class\",\"alert alert-warning\",null],[10],[1,1,0,0,\"\\n  This is a protected page only visible to authenticated users!\\n\"],[11],[1,1,0,0,\"\\n\"],[9,\"h2\",true],[10],[1,1,0,0,\"Posts\"],[11],[1,1,0,0,\"\\n\"],[9,\"ul\",true],[10],[1,1,0,0,\"\\n\"],[5,[27,[26,2,\"BlockHead\"],[]],[[31,0,0,[27,[26,1,\"CallHead\"],[]],[[31,0,0,[27,[26,1,\"CallHead\"],[]],[[27,[26,0,\"Expression\"],[]]],null]],null]],null,[[\"default\"],[{\"statements\":[[1,1,0,0,\"    \"],[9,\"li\",true],[10],[1,1,0,0,\"\\n      \"],[9,\"h3\",true],[10],[1,0,0,0,[27,[24,1],[\"title\"]]],[11],[1,1,0,0,\"\\n      \"],[9,\"p\",true],[10],[1,0,0,0,[27,[24,1],[\"body\"]]],[11],[1,1,0,0,\"\\n    \"],[11],[1,1,0,0,\"\\n\"]],\"parameters\":[1]}]]],[11]],\"hasEval\":false,\"upvars\":[\"model\",\"-track-array\",\"each\"]}",
    "meta": {
      "moduleName": "test-app/templates/protected.hbs"
    }
  });

  _exports.default = _default;
});
;define("test-app/torii-providers/facebook", ["exports", "torii/providers/facebook-oauth2"], function (_exports, _facebookOauth) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _facebookOauth.default.extend({
    redirectUri: Ember.computed(function () {
      return [window.location.protocol, '//', window.location.host, '/torii/redirect.html'].join('');
    }),

    fetch(data) {
      return data;
    }

  });

  _exports.default = _default;
});
;define("test-app/transforms/boolean", ["exports", "@ember-data/serializer/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _private.BooleanTransform;
    }
  });
});
;define("test-app/transforms/date", ["exports", "@ember-data/serializer/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _private.DateTransform;
    }
  });
});
;define("test-app/transforms/number", ["exports", "@ember-data/serializer/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _private.NumberTransform;
    }
  });
});
;define("test-app/transforms/string", ["exports", "@ember-data/serializer/-private"], function (_exports, _private) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _private.StringTransform;
    }
  });
});
;

;define('test-app/config/environment', [], function() {
  if (typeof FastBoot !== 'undefined') {
return FastBoot.config('test-app');
} else {
var prefix = 'test-app';try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

}
});

;
if (typeof FastBoot === 'undefined') {
  if (!runningTests) {
    require('test-app/app')['default'].create({});
  }
}

//# sourceMappingURL=test-app.map
