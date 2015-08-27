/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import applyConfig from 'ember-simple-auth/utils/apply-config';

describe('applyConfig', () => {
  it('returns a function', () => {
    expect(applyConfig()).to.be.a('function');
  });

  describe('the application function', () => {
    let object;

    beforeEach(() => {
      object = {
        setting:    null,
        applyConfig: applyConfig({ setting: 'defaultValue' })
      };
    });

    it('applies a value if present on the config object', () => {
      object.applyConfig({ setting: 'configValue' });

      expect(object.setting).to.eq('configValue');
    });

    it('applies the default value when a setting is not present on the config object', () => {
      object.applyConfig({});

      expect(object.setting).to.eq('defaultValue');
    });

    it('ignores settings that are not properties of the configured object', () => {
      object.applyConfig({ unknown: 'configValue' });

      expect(object).to.not.haveOwnProperty('unknown');
    });

    it('does not change methods of the configured object', () => {
      object.applyConfig({ applyConfig: 'configValue' });

      expect(object.applyConfig).to.not.eq('configValue');
    });
  });
});
