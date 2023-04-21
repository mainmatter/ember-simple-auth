import Application from '../../app';
import config from '../../config/environment';
import { run } from '@ember/runloop';

export default function startApp(attrs) {
  let attributes = Object.assign({}, config.APP);
  attributes.autoboot = true;
  attributes = Object.assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
