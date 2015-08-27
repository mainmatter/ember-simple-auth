/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import loadConfig from 'ember-simple-auth/utils/load-config';

describe('loadConfig', () => {
  it('returns a function', () => {
    expect(loadConfig()).to.be.a('function');
  });

  describe('the application function', () => {
    let object;

    beforeEach(() => {
      object = {
        setting:    null,
        loadConfig: loadConfig({ setting: 'defaultValue' })
      };
    });

    it('applies a value if present on the config object', () => {
      object.loadConfig({ setting: 'configValue' });

      expect(object.setting).to.eq('configValue');
    });

    it('applies the default value when a setting is not present on the config object', () => {
      object.loadConfig({});

      expect(object.setting).to.eq('defaultValue');
    });

    it('ignores settings that are not properties of the configured object', () => {
      object.loadConfig({ unknown: 'configValue' });

      expect(object).to.not.haveOwnProperty('unknown');
    });

    it('does not change methods of the configured object', () => {
      object.loadConfig({ loadConfig: 'configValue' });

      expect(object.loadConfig).to.not.eq('configValue');
    });
  });
});
