import { parseAcceptLanguageHeader } from './parseAcceptLanguageHeader.js';
import { isLocale, pickLocale } from 'locale-matcher';

/**
 * Options of {@link detectLocale}.
 */
export interface DetectLocaleOptions {
  /**
   * The current URL.
   */
  url: URL | string;

  /**
   * The array of supported locales.
   *
   * @example
   * ['en-US', 'ru-RU]
   */
  locales: readonly string[];

  /**
   * The default locale that should be used if a preferred locale cannot be detected or isn't supported.
   *
   * @example
   * 'en-US'
   */
  defaultLocale: string;

  /**
   * The [`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language)
   * header value or {@link navigator.languages}.
   *
   * @example
   * 'en-US,en;q=0.9,fr;q=0.8,de;q=0.7'
   *
   * @example
   * ['en-US', 'ru-RU']
   */
  userLanguages?: readonly string[] | string | null | undefined;

  /**
   * Mapping from a host to a corresponding locale.
   *
   * If host doesn't have a mapping then the {@link defaultLocale} is used.
   *
   * @example
   * {
   *   'en.example.com': 'en-US',
   *   'ru.example.com': 'ru-RU',
   * }
   */
  hostLocales?: Record<string, string>;
}

/**
 * The result of {@link detectLocale}.
 */
export interface DetectedLocale {
  /**
   * The normalized URL that reflects the {@link locale}.
   */
  url: string;

  /**
   * The locale that should be used for the {@link url}.
   */
  locale: string;

  /**
   * `true` if {@link url} contains a {@link locale} as a leading segment of its pathname.
   */
  hasPathnameLocale: boolean;
}

export function detectLocale(options: DetectLocaleOptions): DetectedLocale {
  const { locales, defaultLocale, userLanguages, hostLocales } = options;

  const url = new URL(options.url);

  const separatorIndex = url.pathname.indexOf('/', 1);

  const pathnameLocale = url.pathname.substring(1, separatorIndex !== -1 ? separatorIndex : url.pathname.length);

  const hostLocale = hostLocales !== undefined ? hostLocales[url.host] : undefined;

  let pickedHost = url.host;

  let pickedLocale =
    (pathnameLocale && pickLocale(pathnameLocale, locales)) ||
    hostLocale ||
    pickLocale(parseAcceptLanguageHeader(userLanguages), locales) ||
    defaultLocale;

  // Search for a host that best matches the picked locale
  if (hostLocales !== undefined) {
    for (const host in hostLocales) {
      if (pickLocale(pickedLocale, [hostLocales[host]]) !== undefined) {
        pickedHost = host;
        hostLocale = hostLocales[host];
        break;
      }
    }
  }

  const hasPathnameLocale = pickedLocale !== (hostLocale || defaultLocale);

  return {
    url:
      url.protocol +
      '//' +
      url.password +
      (url.username !== '' ? ':' + url.username : '') +
      pickedHost +
      (hasPathnameLocale ? '/' + pickedLocale : '') +
      (isLocale(pathnameLocale) ? url.pathname.substring(pathnameLocale.length) : url.pathname) +
      url.search +
      url.hash,

    locale: pickedLocale,
    hasPathnameLocale,
  };
}
