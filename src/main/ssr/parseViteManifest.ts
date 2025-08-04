import type * as Vite from 'vite';
import { Manifest, ManifestChunk } from '../useManifest.js';

export function parseViteManifest(manifest: Vite.Manifest): Manifest {
  const chunks = Object.values(manifest);

  return {
    bootstrapChunks: chunks.reduce<ManifestChunk[]>((bootstrapChunks, chunk) => {
      if (!chunk.isEntry) {
        return bootstrapChunks;
      }

      bootstrapChunks.push({ type: 'js', url: '/' + chunk.file });

      chunk.css?.forEach(url => bootstrapChunks.push({ type: 'css', url: '/' + url }));

      return bootstrapChunks;
    }, []),

    preloadedChunks: [],
  };
}
