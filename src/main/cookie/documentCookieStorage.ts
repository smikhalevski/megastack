import { AccessorCookieStorage } from './AccessorCookieStorage.js';
import { CookieStorage } from './types.js';

/**
 * Cookie storage that uses {@link document.cookie} to read and write cookies.
 */
export const documentCookieStorage: CookieStorage = new AccessorCookieStorage(
  () => document.cookie,

  cookie => {
    document.cookie = cookie;
  }
);
