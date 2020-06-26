import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mockServer, visit } from 'ember-cli-fastboot-testing/test-support';
import { setupFastbootTest } from '../helpers/fastboot';
import config from '../../config/environment';

describe('FastBoot: /protected', function() {
  setupFastbootTest();

  it('redirects to login page when the session is not authenticated', async function() {
    let { headers, statusCode } = await visit('/protected');

    expect(statusCode).to.eq(307);
    expect(headers.location).to.match(/\/login$/);
  });

  it('can be accessed when the session is authenticated', async function() {
    await mockServer.get(`${config.apiHost}/accounts/1`, {
      data: {
        type: 'accounts',
        id: '1',
        attributes: {
          login: 'letme',
          name: 'Some person'
        }
      }
    });
    await mockServer.get(`${config.apiHost}/posts`, {
      data: []
    });

    let { url, statusCode } = await visit('/protected', {
      headers: {
        cookie: 'ember_simple_auth-session=%7B%22authenticated%22%3A%7B%22authenticator%22%3A%22authenticator%3Aoauth2%22%2C%22access_token%22%3A%22secret%20token!%22%2C%22account_id%22%3A1%7D%7D'
      }
    });

    expect(statusCode).to.eq(200);
    expect(url).to.eq('/protected');
  });
});
