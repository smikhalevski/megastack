import { getCookieNames, getCookieValue, parseCookies, stringifyCookie } from './cookie-utils.js';
import { CookieOptions, CookieStorage } from './types.js';

/**
 * Cookie storage that uses getter and setter to read and write cookies.
 */
export class AccessorCookieStorage implements CookieStorage {
  private _getCookie;
  private _setCookie;

  constructor(getCookie: () => string[] | string | null | undefined, setCookie: (cookie: string) => void) {
    this._getCookie = getCookie;
    this._setCookie = setCookie;
  }

  getNames() {
    return getCookieNames(this._getCookie());
  }

  getAll(): Record<string, string> {
    return parseCookies(this._getCookie());
  }

  get(name: string): string | undefined {
    return getCookieValue(this._getCookie(), name);
  }

  set(name: string, value: string | null | undefined, options?: CookieOptions): void {
    if (value === null || value === undefined) {
      this.delete(name);
    } else {
      this._setCookie(stringifyCookie(name, value, options));
    }
  }

  has(name: string): boolean {
    return this.get(name) !== undefined;
  }

  delete(name: string): void {
    this._setCookie(stringifyCookie(name, '', { maxAge: 0 }));
  }

  *[Symbol.iterator]() {
    return Object.entries(this.getAll());
  }
}
