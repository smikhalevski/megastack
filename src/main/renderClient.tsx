import React, { ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { History, HistoryProvider } from 'react-corsair/history';
import { hydrateRouter, Router, RouterProvider, Serializer } from 'react-corsair';
import { ExecutorManager, ExecutorManagerProvider, hydrateExecutorManager } from 'react-executor';
import { CookieStorageContext } from './useCookieStorage.js';
import { CookieStorage } from 'whoopie';

export interface RenderClientOptions {
  history: History;
  router: Router;
  executorManager: ExecutorManager;
  cookieStorage: CookieStorage;
  isHydrated?: boolean;
  serializer?: Serializer;
  children?: ReactNode;
}

export function renderClient(options: RenderClientOptions): void {
  const { history, router, executorManager, cookieStorage, isHydrated, serializer, children } = options;

  history.subscribe(() => {
    router.navigate(history.location);
  });

  router.subscribe(event => {
    if (event.type === 'redirect') {
      history.replace(event.to);
    }
  });

  const element = (
    <CookieStorageContext value={cookieStorage}>
      <HistoryProvider value={history}>
        <RouterProvider value={router}>
          <ExecutorManagerProvider value={executorManager}>{children}</ExecutorManagerProvider>
        </RouterProvider>
      </HistoryProvider>
    </CookieStorageContext>
  );

  if (isHydrated) {
    hydrateExecutorManager(executorManager, { serializer });
    hydrateRouter(router, history.location, { serializer });
    hydrateRoot(document, element);
    return;
  }

  router.navigate(history.location);
  createRoot(document).render(element);
}
