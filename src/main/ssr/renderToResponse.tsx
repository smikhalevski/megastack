import { renderToReadableStream } from 'react-dom/server.browser';
import { History, HistoryProvider } from 'react-corsair/history';
import { SSRRouter } from 'react-corsair/ssr';
import React, { ReactNode } from 'react';
import { createChunkInjector } from './createChunkInjector.js';
import { SSRExecutorManager } from 'react-executor/ssr';
import { RenderToReadableStreamOptions } from 'react-dom/server';
import { Redirect, RouterProvider, To } from 'react-corsair';
import { ExecutorManagerProvider } from 'react-executor';
import { ScriptInjectorProvider } from './useScriptInjector.js';

export interface RenderToResponseOptions extends Omit<RenderToReadableStreamOptions, 'onError'> {
  history: History;
  router: SSRRouter;
  executorManager: SSRExecutorManager;
  isBot?: boolean;
  prefetchModules?: string[];
  bootstrapCSS?: string[];
  children?: ReactNode;
  headers?: HeadersInit;
}

export async function renderToResponse(options: RenderToResponseOptions): Promise<Response> {
  const {
    history,
    router,
    executorManager,
    headers: headersInit,
    prefetchModules,
    bootstrapCSS,
    signal,
    nonce,
    children,
    isBot,
    bootstrapModules,
    bootstrapScriptContent,
    bootstrapScripts,
    identifierPrefix,
    namespaceURI,
    progressiveChunkSize,
  } = options;

  let response: Response | undefined;
  let status = 200;

  signal?.addEventListener('abort', () => {
    router.abort(signal.reason);
    executorManager.abort(signal.reason);
  });

  const pushRedirect = (to: To | string) => {
    const url = history.toAbsoluteURL(to);

    if (response !== undefined) {
      pushScript(`window.location.replace(${JSON.stringify(url)});`);
      stream.cancel();
    } else {
      response = Response.redirect(url);
    }
  };

  router.subscribe(event => {
    switch (event.type) {
      case 'not_found':
        status = 404;
        break;

      case 'redirect':
        pushRedirect(event.to);
        break;
    }
  });

  router.navigate(history.location);

  const chunkInjector = createChunkInjector(() => executorManager.nextHydrationChunk() + router.nextHydrationChunk());

  const pushScript = (scriptSource: string): void => {
    chunkInjector.pushChunk(`<script${nonce === undefined ? '' : ` nonce="${nonce}"`}>${scriptSource}</script>`);
  };

  if (response !== undefined) {
    return response;
  }

  const cssLinks =
    isBot ||
    bootstrapCSS?.map(href => (
      <link
        key={href}
        precedence={'default'}
        rel={'stylesheet'}
        href={href}
      />
    ));

  const prefetchLinks =
    isBot ||
    prefetchModules?.map(href => (
      <link
        key={href}
        rel={'modulepreload'}
        fetchPriority={'low'}
        href={href}
      />
    ));

  const stream = await renderToReadableStream(
    <HistoryProvider value={history}>
      <RouterProvider value={router}>
        <ExecutorManagerProvider value={executorManager}>
          <ScriptInjectorProvider value={pushScript}>
            {cssLinks}
            {prefetchLinks}
            {children}
          </ScriptInjectorProvider>
        </ExecutorManagerProvider>
      </RouterProvider>
    </HistoryProvider>,
    {
      identifierPrefix,
      namespaceURI,
      nonce,
      bootstrapScriptContent,
      bootstrapScripts,
      bootstrapModules,
      progressiveChunkSize,
      signal,

      onError(error) {
        if (error instanceof Redirect) {
          pushRedirect(error.to);
        }
      },
    }
  );

  const headers = new Headers(headersInit);

  headers.set('Content-Type', 'text/html; charset=utf-8');

  if (isBot) {
    await stream.allReady;

    response = new Response(stream, { status, headers });
  } else {
    response = new Response(stream.pipeThrough(chunkInjector), { status, headers });
  }

  return response;
}
