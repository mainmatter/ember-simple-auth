import { importSync } from '@embroider/macros';

let assign;

try {
  assign = importSync('@ember/polyfills').assign;
} catch (error) {
  // Couldn't import @ember/polyfills
  // Doesn't exist in v5
}

export default Object.assign || assign;
