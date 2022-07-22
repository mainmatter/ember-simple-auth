import Application from '../../app';
import config from '../../config/environment';
import { run } from '@ember/runloop';
import assign from 'ember-simple-auth/utils/assign';

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes.autoboot = true;
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
