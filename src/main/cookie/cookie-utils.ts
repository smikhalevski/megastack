import { CookieOptions } from './types.js';

/**
 * Parses [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie) header value as
 * a name-value record.
 *
 * @param cookie The [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie) header value
 * or {@link document.cookie}.
 */
export function parseCookies(cookie: string[] | string | null | undefined): Record<string, string> {
  if (cookie === '' || cookie === null || cookie === undefined) {
    return {};
  }

  if (Array.isArray(cookie)) {
    cookie = cookie.join(';');
  }

  const record: Record<string, string> = {};

  for (let startIndex = 0, endIndex; startIndex < cookie.length; startIndex = endIndex + 1) {
    endIndex = cookie.indexOf(';', startIndex);

    if (endIndex === -1) {
      endIndex = cookie.length;
    }

    const valueIndex = cookie.indexOf('=', startIndex);

    if (valueIndex === -1 || valueIndex > endIndex) {
      continue;
    }

    record[decodeURIComponent(cookie.substring(startIndex, valueIndex).trim())] = decodeURIComponent(
      cookie.substring(valueIndex + 1, endIndex).trim()
    );
  }

  return record;
}

/**
 * Returns the array of cookie names.
 *
 * @param cookie The [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie) header value
 * or {@link document.cookie}.
 */
export function getCookieNames(cookie: string[] | string | null | undefined): string[] {
  if (cookie === '' || cookie === null || cookie === undefined) {
    return [];
  }

  if (Array.isArray(cookie)) {
    cookie = cookie.join(';');
  }

  const names = [];

  for (let startIndex = 0, endIndex; startIndex < cookie.length; startIndex = endIndex + 1) {
    endIndex = cookie.indexOf(';', startIndex);

    if (endIndex === -1) {
      endIndex = cookie.length;
    }

    const valueIndex = cookie.indexOf('=', startIndex);

    if (valueIndex === -1 || valueIndex > endIndex) {
      continue;
    }

    names.push(decodeURIComponent(cookie.substring(startIndex, valueIndex).trim()));
  }

  return names;
}

/**
 * Returns the value of a cookie with the given name.
 *
 * @param cookie The [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie) header value
 * or {@link document.cookie}.
 * @param name The name of a cookie to retrieve.
 * @returns A cookie value or `undefined` if there's no cookie with the given name.
 */
export function getCookieValue(cookie: string[] | string | null | undefined, name: string): string | undefined {
  if (cookie === '' || cookie === null || cookie === undefined) {
    return;
  }

  if (Array.isArray(cookie)) {
    cookie = cookie.join(';');
  }

  name = encodeURIComponent(name);

  nextCookie: for (let startIndex = 0, endIndex; startIndex < cookie.length; startIndex = endIndex + 1) {
    endIndex = cookie.indexOf(';', startIndex);

    if (endIndex === -1) {
      endIndex = cookie.length;
    }

    let valueStartIndex = cookie.indexOf('=', startIndex);

    if (valueStartIndex === -1 || valueStartIndex > endIndex) {
      continue;
    }

    // Compare the current cookie name and the requested name
    for (let i = startIndex, j = 0; i < valueStartIndex; ++i) {
      const charCode = cookie.charCodeAt(i);

      if ((j === 0 || j === name.length) && isSpaceChar(charCode)) {
        continue;
      }

      if (j === name.length || charCode !== name.charCodeAt(j++)) {
        continue nextCookie;
      }
    }

    let valueEndIndex = ++valueStartIndex;

    // Skip spaces at value start and at value end
    for (let i = valueStartIndex; i < endIndex; ++i) {
      const charCode = cookie.charCodeAt(i);

      if (!isSpaceChar(charCode)) {
        valueEndIndex = i + 1;
        continue;
      }

      if (valueStartIndex === valueEndIndex) {
        valueEndIndex = ++valueStartIndex;
      }
    }

    return decodeURIComponent(cookie.substring(valueStartIndex, valueEndIndex));
  }
}

function isSpaceChar(charCode: number): boolean {
  return charCode == /* \s */ 32 || charCode === /* \n */ 10 || charCode === /* \t */ 9 || charCode === /* \r */ 13;
}

/**
 * Stringifies cookie and corresponding options.
 *
 * @returns [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) header value.
 */
export function stringifyCookie(name: string, value: string, options?: CookieOptions): string {
  let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  if (options === undefined) {
    return cookie;
  }

  if (options.expiresAt !== undefined) {
    const date = new Date(options.expiresAt);

    if (+date === +date) {
      cookie += '; Expires=' + date.toUTCString();
    }
  }

  if (options.maxAge !== undefined) {
    cookie += '; Max-Age=' + ((options.maxAge / 1_000) | 0);
  }

  if (options.path !== undefined) {
    cookie += '; Path=' + options.path;
  }

  if (options.domain !== undefined) {
    cookie += '; Domain=' + options.domain;
  }

  if (options.sameSite !== undefined) {
    cookie += '; SameSite=' + options.sameSite;
  }

  if (options.isSecure !== undefined) {
    cookie += '; Secure';
  }

  if (options.isHttpOnly !== undefined) {
    cookie += '; HttpOnly';
  }

  return cookie;
}
