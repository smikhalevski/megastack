import { parseAcceptLanguageHeader } from './parseAcceptLanguageHeader.js';
import { isLocale, pickLocale } from 'locale-matcher';
import { use } from 'react';

export interface DetectLocaleOptions {
  url: URL | string;
  locales: readonly string[];
  defaultLocale: string;
  userLanguages?: readonly string[] | string | null | undefined;
  hostLocales?: Record<string, string>;
}

export interface DetectedLocale {
  url: string;
  locale: string;
  hasPathnameLocale: boolean;
}

function getBase(url: URL, host: string): string {
  return url.protocol + '//' + url.password + (url.username !== '' ? ':' + url.username : '') + host;
}

function getPathnameLocale(pathname: string): string {
  const separatorIndex = pathname.indexOf('/', 1);

  const locale = pathname.substring(1, separatorIndex !== -1 ? separatorIndex : pathname.length);

  return isLocale(locale) ? locale : '';
}

function getHostByLocale(hostLocales: Record<string, string> | undefined, locale: string): string | undefined {
  if (hostLocales === undefined) {
    return;
  }
  for (const host in hostLocales) {
    if (hostLocales[host] === locale) {
      return host;
    }
  }
}

export function detectLocale(options: DetectLocaleOptions): DetectedLocale {
  const { locales, defaultLocale, hostLocales } = options;

  const url = new URL(options.url);

  const searchHash = url.search + url.hash;

  const hostLocale = hostLocales?.[url.host];

  const pathnameLocale = getPathnameLocale(url.pathname);

  const restPathname = url.pathname.substring(pathnameLocale.length);

  if (hostLocale !== undefined) {
    return {
      url: getBase(url, url.host) + restPathname + searchHash,
      locale: hostLocale,
      hasPathnameLocale: false,
    };
  }

  const pickedLocale =
    (pathnameLocale !== '' && pickLocale(pathnameLocale, locales)) ||
    pickLocale(parseAcceptLanguageHeader(options.userLanguages), locales, defaultLocale);

  const host = getHostByLocale(hostLocales, pickedLocale);

  if (host !== undefined) {
    return {
      url: getBase(url, host) + restPathname + searchHash,
      locale: pickedLocale,
      hasPathnameLocale: false,
    };
  }

  return {
    url: getBase(url, url.host) + '/' + pickedLocale + restPathname + searchHash,
    locale: pickedLocale,
    hasPathnameLocale: true,
  };
}
