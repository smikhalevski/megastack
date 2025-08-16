import { createContext, useContext } from 'react';

const ScriptInjectorContext = createContext<((scriptSource: string) => void) | null>(null);

ScriptInjectorContext.displayName = 'ScriptInjectorContext';

export const ScriptInjectorProvider = ScriptInjectorContext.Provider;

export function useScriptInjector(): ((scriptSource: string) => void) | null {
  return useContext(ScriptInjectorContext);
}
