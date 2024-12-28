import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

// Add extensions here, such as ts, gjs, etc that you may import
const extensions = ['.js', '.ts'];

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints([
      'services/**/*.js',
      'session-stores/**/*.js',
      'utils/is-fastboot.js',
      'utils/**/*.js',
      'authenticators/**/*.js',
      'test-support/**/*.js',
      'configuration.js',
      'initializers/**/*.js',
    ]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports([
      'services/session.js',
      'utils/**/*.js',
      'session-stores/application.js',
      'initializers/ember-simple-auth.js',
    ]),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    //
    // By default, this will load the actual babel config from the file
    // babel.config.json.
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),

    // Allows rollup to resolve imports of files with the specified extensions
    nodeResolve({ extensions }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Emit .d.ts
    addon.declarations('declarations'),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    // addon.keepAssets(['**/*.css']),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),

    // Copy Readme and License into published package
    copy({
      targets: [
        { src: '../../README.md', dest: '.' },
        { src: '../../LICENSE', dest: '.' },
      ],
    }),
  ],
};
