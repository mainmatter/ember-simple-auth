import Ember from 'ember';

import { describe, it } from 'mocha';
import { expect } from 'chai';

const { libraries } = Ember;

describe('register-version', () => {
  it('registers "Ember Simple Auth" as a library', function() {
    expect(libraries._getLibraryByName('Ember Simple Auth')).to.be.ok;
  });
});
