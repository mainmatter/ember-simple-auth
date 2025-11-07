import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import { service } from '@ember/service';
import { CacheHandler, Fetch, RequestManager } from '@warp-drive/core';

class AuthHandler {
  session = null;

  constructor(session) {
    this.session = session;
  }

  request(context, next) {
    const headers = new Headers(context.request.headers);

    if (this.session.get('isAuthenticated')) {
      headers.append('Authorization', `Bearer ${this.session.data.authenticated.access_token}`);
    }

    return next(Object.assign({}, context.request, { headers })).catch(err => {
      if (err.code === 401 && this.session.get('isAuthenticated')) {
        this.session.invalidate();
        throw new Error('Unauthorized!');
      }

      return err;
    });
  }
}

const LegacyStore = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: false,
  cache: JSONAPICache,
  schemas: [
    {
      type: 'posts',
      identity: { kind: '@id', name: 'id' },
      legacy: true,
      fields: [
        { kind: 'field', name: 'title', sourceKey: 'title' },
        { kind: 'field', name: 'body', sourceKey: 'body' },
      ],
    },
    {
      type: 'accounts',
      identity: { kind: '@id', name: 'id' },
      legacy: true,
      fields: [
        { kind: 'field', name: 'login', sourceKey: 'login' },
        { kind: 'field', name: 'name', sourceKey: 'name' },
      ],
    },
  ],
});

export default class TestAppStore extends LegacyStore {
  @service session;

  requestManager = new RequestManager()
    .use([new AuthHandler(this.session), Fetch])
    .useCache(CacheHandler);
}
