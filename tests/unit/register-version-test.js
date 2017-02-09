import Ember from 'ember';

import { describe, it } from 'mocha';
import { expect } from 'chai';

import ENV from 'dummy/config/environment';

const { libraries } = Ember;
const expectedVersion = ENV.esaVersion;

describe('register-version', () => {
  it('registers "Ember Simple Auth" as a library', function() {
    expect(libraries._getLibraryByName('Ember Simple Auth')).to.deep.equal({
      name: 'Ember Simple Auth',
      version: expectedVersion,
    });
  });
});
