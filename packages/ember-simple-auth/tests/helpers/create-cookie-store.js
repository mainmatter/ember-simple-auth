import Cookie from 'ember-simple-auth/session-stores/cookie';

export default function createCookieStore(cookiesService, options = {}) {
  options._cookies = cookiesService;
  options._fastboot = { isFastBoot: false };
  return Cookie.create(options);
}
