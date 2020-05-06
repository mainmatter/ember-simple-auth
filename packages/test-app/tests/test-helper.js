import { setApplication } from '@ember/test-helpers';
import Application from '../app';
import config from '../config/environment';

setApplication(Application.create(config.APP));
