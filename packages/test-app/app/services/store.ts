import { CacheHandler, Fetch, RequestManager, Store } from '@warp-drive/core';
import {
  instantiateRecord,
  registerDerivations,
  SchemaService,
  teardownRecord,
  withDefaults,
} from '@warp-drive/core/reactive';
import { DefaultCachePolicy } from '@warp-drive/core/store';
import type { CacheCapabilitiesManager, ResourceKey } from '@warp-drive/core/types';
import { JSONAPICache } from '@warp-drive/json-api';
import { service } from '@ember/service';
import type SessionService from './session';

class AuthHandler {
  session: SessionService;

  constructor(session: SessionService) {
    this.session = session;
  }

  request(context: any, next: any) {
    const headers = new Headers(context.request.headers);

    if (this.session.get('isAuthenticated')) {
      headers.append('Authorization', `Bearer ${this.session.data.authenticated.access_token}`);
    }

    return next(Object.assign({}, context.request, { headers })).catch((err: any) => {
      if (err.code === 401 && this.session.get('isAuthenticated')) {
        this.session.invalidate();
        throw new Error('Unauthorized!');
      }

      return err;
    });
  }
}

export const PostSchema = withDefaults({
  type: 'posts',
  identity: { kind: '@id', name: 'id' },
  fields: [
    { kind: 'field', name: 'title', sourceKey: 'title' },
    { kind: 'field', name: 'body', sourceKey: 'body' },
  ],
});

export const AccountSchema = withDefaults({
  type: 'accounts',
  identity: { kind: '@id', name: 'id' },
  fields: [
    { kind: 'field', name: 'login', sourceKey: 'login' },
    { kind: 'field', name: 'name', sourceKey: 'name' },
  ],
});

export default class AppStore extends Store {
  @service session!: SessionService;
  @service fastboot!: any;

  requestManager =
    this.fastboot && this.fastboot.isFastBoot
      ? new RequestManager().use([new AuthHandler(this.session), Fetch])
      : new RequestManager().use([new AuthHandler(this.session), Fetch]).useCache(CacheHandler);

  lifetimes = new DefaultCachePolicy({
    apiCacheHardExpires: 15 * 60 * 1000, // 15 minutes
    apiCacheSoftExpires: 1 * 30 * 1000, // 30 seconds
    constraints: {
      headers: {
        'X-WarpDrive-Expires': true,
        'Cache-Control': true,
        Expires: true,
      },
    },
  });

  createSchemaService() {
    const schema = new SchemaService();
    registerDerivations(schema);
    schema.registerResource(PostSchema);
    schema.registerResource(AccountSchema);
    return schema;
  }

  createCache(capabilities: CacheCapabilitiesManager) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(key: ResourceKey, createArgs?: Record<string, unknown>) {
    return instantiateRecord(this, key, createArgs);
  }

  teardownRecord(record: unknown): void {
    return teardownRecord(record);
  }
}
