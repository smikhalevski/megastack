import { getCookieNames, getCookieValue, parseCookies, stringifyCookie } from './cookie-utils.js';
import { CookieStorage } from './types.js';

/**
 * Options of {@link createCookieStorage}.
 */
export interface CookieStorageOptions {
  /**
   * Returns cookies.
   *
   * @example
   * () => document.cookie
   */
  getCookie: () => readonly string[] | string | null | undefined;

  /**
   * Sets a new cookie.
   *
   * @example
   * cookie => document.cookie = cookie
   */
  setCookie: (cookie: string) => void;
}

/**
 * Creates a new cookie storage that uses getter and setter to access cookies.
 */
export function createCookieStorage(options: CookieStorageOptions): CookieStorage {
  const { getCookie, setCookie } = options;

  return {
    getNames() {
      return getCookieNames(getCookie());
    },

    getAll() {
      return parseCookies(getCookie());
    },

    get(name) {
      return getCookieValue(getCookie(), name);
    },

    set(name, value, options) {
      if (value === null || value === undefined) {
        value = '';
        options = { maxAge: 0 };
      }

      setCookie(stringifyCookie(name, value, options));
    },

    has(name) {
      return getCookieValue(getCookie(), name) !== undefined;
    },

    delete(name) {
      setCookie(stringifyCookie(name, '', { maxAge: 0 }));
    },

    *[Symbol.iterator]() {
      return Object.entries(parseCookies(getCookie()));
    },
  };
}
