import React, { ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { History, HistoryProvider } from 'react-corsair/history';
import { hydrateRouter, Router, RouterProvider, Serializer } from 'react-corsair';
import { ExecutorManager, ExecutorManagerProvider, hydrateExecutorManager } from 'react-executor';

export interface StartClientOptions {
  history: History;
  router: Router;
  executorManager: ExecutorManager;
  isHydrated?: boolean;
  serializer?: Serializer;
  children?: ReactNode;
}

export function startClient(options: StartClientOptions): void {
  const { history, router, executorManager, isHydrated, serializer, children } = options;

  history.subscribe(() => router.navigate(history.location));

  router.subscribe(event => {
    if (event.type === 'redirect') {
      history.replace(event.to);
    }
  });

  const element = (
    <HistoryProvider value={history}>
      <RouterProvider value={router}>
        <ExecutorManagerProvider value={executorManager}>{children}</ExecutorManagerProvider>
      </RouterProvider>
    </HistoryProvider>
  );

  if (isHydrated) {
    hydrateExecutorManager(executorManager, { serializer });
    hydrateRouter(router, history.location, { serializer });
    hydrateRoot(document, element);
  } else {
    router.navigate(history.location);
    createRoot(document).render(element);
  }
}
