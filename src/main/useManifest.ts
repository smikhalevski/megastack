import { createContext, useContext } from 'react';

export interface ManifestChunk {
  type: 'js' | 'css';
  url: string;
}

export interface Manifest {
  bootstrapChunks: ManifestChunk[];
  preloadedChunks: ManifestChunk[];
}

const ManifestContext = createContext<Manifest | null>(null);

ManifestContext.displayName = 'ManifestContext';

export const ManifestProvider = ManifestContext.Provider;

export function useManifest(): Manifest {
  const manifest = useContext(ManifestContext);

  if (manifest === null) {
    throw new Error('Cannot be used outside of a ManifestProvider');
  }

  return manifest;
}
