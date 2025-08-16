import { Manifest } from 'vite';

export function parseViteManifest(
  basePathname: string,
  manifest: Manifest
): {
  bootstrapModules: string[];
  prefetchModules: string[];
  bootstrapCSS: string[];
} {
  const bootstrapModules = [];
  const prefetchModules = [];
  const bootstrapCSS = [];

  for (const chunk of Object.values(manifest)) {
    if (!chunk.isEntry) {
      continue;
    }

    bootstrapModules.push(basePathname + chunk.file);

    if (chunk.imports !== undefined) {
      for (const url of chunk.imports) {
        prefetchModules.push(basePathname + url.replace(/^_/, ''));
      }
    }

    if (chunk.css !== undefined) {
      for (const url of chunk.css) {
        bootstrapCSS.push(basePathname + url.replace(/^_/, ''));
      }
    }
  }

  return { bootstrapModules, prefetchModules, bootstrapCSS };
}
