import sinonChai from 'npm:sinon-chai';
import { use } from 'chai';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

setResolver(resolver);

use(sinonChai);
