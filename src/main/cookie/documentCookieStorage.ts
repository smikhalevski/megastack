import { createCookieStorage } from './createCookieStorage.js';

/**
 * Cookie storage that uses {@link document.cookie} to read and write cookies.
 */
export const documentCookieStorage = createCookieStorage({
  getCookie() {
    return document.cookie;
  },

  setCookie(cookie) {
    document.cookie = cookie;
  },
});
