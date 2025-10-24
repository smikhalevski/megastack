import { expect, test } from 'vitest';
import { parseAcceptLanguageHeader } from '../../main/locale/parseAcceptLanguageHeader.js';

test('parses accept language header value', () => {
  expect(parseAcceptLanguageHeader(undefined)).toStrictEqual([]);

  expect(parseAcceptLanguageHeader('')).toStrictEqual([]);
  expect(parseAcceptLanguageHeader('*')).toStrictEqual([]);
  expect(parseAcceptLanguageHeader('*,*')).toStrictEqual([]);
  expect(parseAcceptLanguageHeader('aaa')).toStrictEqual(['aaa']);
  expect(parseAcceptLanguageHeader('aaa,*')).toStrictEqual(['aaa']);
  expect(parseAcceptLanguageHeader('*,aaa')).toStrictEqual(['aaa']);
  expect(parseAcceptLanguageHeader('aaa,bbb')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ,bbb   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ;   q   =   0.5   ,   bbb;q=1   ')).toStrictEqual(['bbb', 'aaa']);
  expect(parseAcceptLanguageHeader('   aaa   ;   Q   =   0.5   ,   bbb;Q=1   ')).toStrictEqual(['bbb', 'aaa']);
  expect(parseAcceptLanguageHeader('   aaa   ;   Z   =   0.5   ,   bbb;q=1   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ;   Q   =   0.5   ,   bbb;Q   ')).toStrictEqual(['bbb', 'aaa']);
  expect(parseAcceptLanguageHeader('   aaa   ;   Q   =   0.5   ,   bbb;Q=xxx   ')).toStrictEqual(['bbb', 'aaa']);
  expect(parseAcceptLanguageHeader('   aaa   ;   Q   =   0.5   ,   bbb;Q=   0.4   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ;   q   =   0.5   ,   bbb;x=1   ')).toStrictEqual(['bbb', 'aaa']);
  expect(parseAcceptLanguageHeader('   aaa   ;   x   =   0.5   ,   bbb;q=1   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ;   x   =   0.5   ,   bbb;q=0.5   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('   aaa   ;   x   =   0.5   ,   bbb;x=0.5   ')).toStrictEqual(['aaa', 'bbb']);
  expect(parseAcceptLanguageHeader('ccc,   aaa   ;   q   =   0.5   ,   bbb;q=1   ,ddd')).toStrictEqual([
    'ccc',
    'bbb',
    'ddd',
    'aaa',
  ]);

  expect(parseAcceptLanguageHeader([])).toStrictEqual([]);
  expect(parseAcceptLanguageHeader(['ccc', '   aaa   ;   q   =   0.5   ,   bbb;q=1   ', 'ddd'])).toStrictEqual([
    'ccc',
    'bbb',
    'ddd',
    'aaa',
  ]);
});
