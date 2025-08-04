import { createContext, useContext } from 'react';

const ScriptInjectorContext = createContext<((source: string) => void) | null>(null);

ScriptInjectorContext.displayName = 'ScriptInjectorContext';

export const ScriptInjectorProvider = ScriptInjectorContext.Provider;

export function useScriptInjector(): ((source: string) => void) | null {
  return useContext(ScriptInjectorContext);
}
