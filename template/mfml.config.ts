import { defineConfig } from 'mfml/compiler';
import allowTags, { defaultAllowedTags } from 'mfml/postprocessor/allowTags';
import allowTypes, { defaultAllowedTypes } from 'mfml/postprocessor/allowTypes';
import { decodeHTML } from 'speedy-entities';
import en_US from './translations/en-US.json' with { type: 'json' };
import ru_RU from './translations/ru-RU.json' with { type: 'json' };

export default defineConfig({
  messages: {
    'en-US': en_US,
    'ru-RU': ru_RU,
  },
  fallbackLocales: {
    'ru-RU': 'en-US',
    'en-US': 'ru-RU',
  },
  decodeText: decodeHTML,
  postprocessors: [allowTags(defaultAllowedTags), allowTypes(defaultAllowedTypes)],
});
