import { createContext, useContext } from 'react';

export const ScriptInjectorContext = createContext<((scriptSource: string) => void) | null>(null);

ScriptInjectorContext.displayName = 'ScriptInjectorContext';

/**
 * Returns a callback that injects a `<script>` tag into an SSR-rendered stream.
 */
export function useScriptInjector(): ((scriptSource: string) => void) | null {
  return useContext(ScriptInjectorContext);
}
