import React, { ComponentType, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserHistory, History, HistoryOptions, HistoryProvider } from 'react-corsair/history';
import { hydrateRouter, Outlet, Router, RouterOptions, RouterProvider } from 'react-corsair';
import { ManifestChunk, ManifestProvider } from './useManifest.js';
import { enableSSRHydration, ExecutorManager, ExecutorManagerProvider } from 'react-executor';

export interface Client {
  history: History;
  router: Router;
}

export interface ClientOptions<Context> extends RouterOptions<Context>, HistoryOptions {
  isHydrated?: boolean;
  rootComponent?: ComponentType;
}

export function startClient<Context>(options: ClientOptions<Context>): Client {
  const { isHydrated, rootComponent: Root = Outlet } = options;

  const executorManager = new ExecutorManager();

  const history = createBrowserHistory(options);

  const router = new Router(options);

  history.subscribe(() => router.navigate(history.location));

  router.subscribe(event => {
    if (event.type === 'redirect') {
      history.replace(event.to);
    }
  });

  const bootstrapChunks = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="text/css"]')
  ).map<ManifestChunk>(link => ({ type: 'css', url: link.href }));

  const rootElement = (
    <StrictMode>
      <HistoryProvider value={history}>
        <RouterProvider value={router}>
          <ExecutorManagerProvider value={executorManager}>
            <ManifestProvider value={{ bootstrapChunks, preloadedChunks: [] }}>
              <Root />
            </ManifestProvider>
          </ExecutorManagerProvider>
        </RouterProvider>
      </HistoryProvider>
    </StrictMode>
  );

  if (isHydrated) {
    hydrateRouter(router, history.location);
    hydrateRoot(document, rootElement);
    enableSSRHydration(executorManager);
  } else {
    router.navigate(history.location);
    createRoot(document).render(rootElement);
  }

  return { history, router };
}
