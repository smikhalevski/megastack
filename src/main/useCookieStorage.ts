import { createContext, useContext } from 'react';
import { CookieStorage } from 'whoopie';

export const CookieStorageContext = createContext<CookieStorage<any> | null>(null);

/**
 * @internal
 */
CookieStorageContext.displayName = 'CookieStorageContext';

/**
 * Returns the current cookie storage.
 */
export function useCookieStorage<Cookies extends Record<string, any>>(): CookieStorage<Cookies> {
  const cookieStorage = useContext(CookieStorageContext);

  if (cookieStorage === null) {
    throw new Error('Cannot be used outside of CookieStorageContext');
  }

  return cookieStorage;
}
