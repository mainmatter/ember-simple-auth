import { macroCondition, dependencySatisfies, importSync } from '@embroider/macros';

let assign;

if (macroCondition(dependencySatisfies('ember-source', '<5.x'))) {
  assign = importSync('@ember/polyfills').assign;
}

export default Object.assign || assign;
