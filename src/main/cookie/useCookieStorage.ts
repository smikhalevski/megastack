import { createContext, useContext } from 'react';
import { CookieStorage } from './types.js';

export const CookieStorageContext = createContext<CookieStorage | null>(null);

/**
 * @internal
 */
CookieStorageContext.displayName = 'CookieStorageContext';

/**
 * Returns the current cookie storage.
 */
export function useCookieStorage(): CookieStorage {
  const cookieStorage = useContext(CookieStorageContext);

  if (cookieStorage === null) {
    throw new Error('Cannot be used outside of CookieStorageContext');
  }

  return cookieStorage;
}
