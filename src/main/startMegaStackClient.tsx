import React, { ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserHistory, History, HistoryOptions, HistoryProvider } from 'react-corsair/history';
import { hydrateRouter, Outlet, Router, RouterOptions, RouterProvider, Serializer } from 'react-corsair';
import { ManifestProvider } from './useManifest.js';
import { ExecutorManager, ExecutorManagerProvider, hydrateExecutorManager } from 'react-executor';

export interface MegaStackClient {
  history: History;
  router: Router;
}

export interface MegaStackClientOptions<Context> extends RouterOptions<Context>, HistoryOptions {
  isHydrated?: boolean;
  serializer?: Serializer;
  rootComponent?: ComponentType;
}

export function startMegaStackClient<Context>(options: MegaStackClientOptions<Context>): MegaStackClient {
  const { isHydrated, rootComponent: Root = Outlet, serializer } = options;

  const executorManager = new ExecutorManager();

  const history = createBrowserHistory(options);

  const router = new Router(options);

  history.subscribe(() => router.navigate(history.location));

  router.subscribe(event => {
    if (event.type === 'redirect') {
      history.replace(event.to);
    }
  });

  const rootElement = (
    <HistoryProvider value={history}>
      <RouterProvider value={router}>
        <ExecutorManagerProvider value={executorManager}>
          <ManifestProvider value={{ bootstrapChunks: [], preloadedChunks: [] }}>
            <Root />
          </ManifestProvider>
        </ExecutorManagerProvider>
      </RouterProvider>
    </HistoryProvider>
  );

  if (isHydrated) {
    hydrateRouter(router, history.location, { serializer });
    hydrateExecutorManager(executorManager, { serializer });
    hydrateRoot(document, rootElement);
  } else {
    router.navigate(history.location);
    createRoot(document).render(rootElement);
  }

  return { history, router };
}
