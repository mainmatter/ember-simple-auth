import * as s from '@ember/service';
const service = s.service ?? s.inject;
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  session: service('session'),
  sessionAccount: service('session-account'),

  logout: action(function () {
    this.get('session').invalidate();
  }),
});
