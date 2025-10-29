/**
 * Returns the array of locales represented by the
 * [`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language) header
 * value, sorted in
 * the [order of locale quality](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language#q).
 * Returns an empty array if there are no languages or all languages
 * are [wildcard](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language#sect).
 *
 * @param headerValue The `Accept-Language` header value.
 */
export function parseAcceptLanguageHeader(headerValue: readonly string[] | string | null | undefined): string[] {
  if (headerValue === '' || headerValue === null || headerValue === undefined) {
    return [];
  }

  if (Array.isArray(headerValue)) {
    headerValue = headerValue.join(',');
  }

  localeWeights.clear();

  for (let startIndex = 0, endIndex; startIndex < headerValue.length; startIndex = endIndex + 1) {
    endIndex = headerValue.indexOf(',', startIndex);

    if (endIndex === -1) {
      endIndex = headerValue.length;
    }

    const weightIndex = headerValue.indexOf(';', startIndex);

    if (weightIndex === -1 || weightIndex > endIndex) {
      const locale = headerValue.substring(startIndex, endIndex).trim();

      if (locale === '' || locale === '*') {
        continue;
      }

      localeWeights.set(locale, 1);
      continue;
    }

    const locale = headerValue.substring(startIndex, weightIndex).trim();

    if (locale === '' || locale === '*') {
      continue;
    }

    localeWeights.set(locale, 1);

    const weightValueIndex = headerValue.indexOf('=', startIndex);

    let weightKey;

    if (
      weightValueIndex === -1 ||
      weightValueIndex > endIndex ||
      !((weightKey = headerValue.substring(weightIndex + 1, weightValueIndex).trim()) === 'q' || weightKey === 'Q')
    ) {
      continue;
    }

    const weight = parseFloat(headerValue.substring(weightValueIndex + 1, endIndex));

    localeWeights.set(locale, weight === weight ? weight : 1);
  }

  return Array.from(localeWeights.keys()).sort(compareLocaleWeight);
}

const localeWeights = new Map<string, number>();

function compareLocaleWeight(a: string, b: string): number {
  return localeWeights.get(b)! - localeWeights.get(a)!;
}
