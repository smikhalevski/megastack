/**
 * Options of a [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) header
 * or a cookie that can be assigned to {@link document.cookie}.
 */
export interface CookieOptions {
  /**
   * Indicates the maximum lifetime of the cookie as an HTTP-date timestamp. See {@link Date} for the required
   * formatting.
   */
  expiresAt?: Date | string | number;

  /**
   * Indicates the number of _seconds_ until the cookie expires. A zero or negative number will expire the cookie
   * immediately.
   *
   * If both {@link expiresAt} and {@link maxAge} are set, {@link maxAge} has precedence.
   */
  maxAge?: number;

  /**
   * Indicates the path that must exist in the requested URL for the browser to send the `Cookie` header.
   */
  path?: string;

  /**
   * Defines the host to which the cookie will be sent.
   *
   * Only the current domain can be set as the value, or a domain of a higher order, unless it is a public suffix.
   * Setting the domain will make the cookie available to it, as well as to all its subdomains.
   *
   * If omitted, this attribute defaults to the host of the current document URL, not including subdomains.
   *
   * Leading dots in domain names (`.example.com`) are ignored.
   *
   * Multiple host/domain values are not allowed, but if a domain is specified, then subdomains are always included.
   */
  domain?: string;

  /**
   * Controls whether or not a cookie is sent with cross-site requests: that is, requests originating from
   * a different site, including the scheme, from the site that set the cookie.
   */
  sameSite?: 'strict' | 'lax' | 'none';

  /**
   * Indicates that the cookie is sent to the server only when a request is made with the `https:` scheme
   * (except on localhost).
   */
  isSecure?: boolean;

  /**
   * Forbids JavaScript from accessing the cookie, for example, through the `document.cookie` property.
   */
  isHttpOnly?: boolean;

  /**
   * Indicates that the cookie should be stored using partitioned storage. Note that if this is set to `true`,
   * {@link isSecure} must also be set to `true`. See
   * [Cookies Having Independent Partitioned State (CHIPS)](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies)
   * for more details.
   */
  isPartitioned?: boolean;
}

/**
 * Reads and writes cookies.
 */
export interface CookieStorage {
  /**
   * Returns names of all existing cookies.
   */
  getNames(): readonly string[];

  /**
   * Returns all cookies as name-value map.
   */
  getAll(): Record<string, string>;

  /**
   * Returns a cookie value by name.
   *
   * @param name The cookie name.
   */
  get(name: string): string | undefined;

  /**
   * Sets the cookie by name.
   *
   * If value is `null` or `undefined` then cookie is deleted.
   *
   * @param name The cookie name.
   * @param value The cookie value.
   * @param options Additional cookie options.
   */
  set(name: string, value: string | null | undefined, options?: CookieOptions): void;

  /**
   * Returns `true` is a cookie with given name exists.
   *
   * @param name The cookie name.
   */
  has(name: string): boolean;

  /**
   * Deletes cookie by name.
   *
   * @param name The cookie name.
   */
  delete(name: string): void;

  /**
   * Iterates over existing cookies.
   */
  [Symbol.iterator](): Iterator<[string, string]>;
}
