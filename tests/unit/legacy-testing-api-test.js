import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  invalidateSession,
  authenticateSession,
  currentSession
} from '../helpers/ember-simple-auth';
import { registerDeprecationHandler } from '@ember/debug';

describe('legacy testing api', () => {
  let app;
  beforeEach(function() {
    app = {
      __container__: {
        lookup() {
          return {
            authenticate() {},
            get() {
              return false;
            }
          };
        }
      },
      testHelpers: {
        wait() {}
      }
    };
  });

  describe('authenticateSession', function() {
    it('is deprecated', function() {
      let warnings = [];
      registerDeprecationHandler((message, options, next) => {
        warnings.push(message);
        next(message, options);
      });
      authenticateSession(app);

      expect(warnings[0]).to.eq('Ember Simple Auth: The legacy testing API is deprecated; switch to the new testing helpers available from "ember-simple-auth/test-support".');
    });
  });

  describe('currentSession', function() {
    it('is deprecated', function() {
      let warnings = [];
      registerDeprecationHandler((message, options, next) => {
        warnings.push(message);
        next(message, options);
      });
      currentSession(app);

      expect(warnings[0]).to.eq('Ember Simple Auth: The legacy testing API is deprecated; switch to the new testing helpers available from "ember-simple-auth/test-support".');
    });
  });

  describe('invalidateSession', function() {
    it('is deprecated', function() {
      let warnings = [];
      registerDeprecationHandler((message, options, next) => {
        warnings.push(message);
        next(message, options);
      });
      invalidateSession(app);

      expect(warnings[0]).to.eq('Ember Simple Auth: The legacy testing API is deprecated; switch to the new testing helpers available from "ember-simple-auth/test-support".');
    });
  });
});
