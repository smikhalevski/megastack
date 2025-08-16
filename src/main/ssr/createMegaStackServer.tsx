import React, { ComponentType } from 'react';
import { createServer, Server } from 'node:http';
import { randomUUID } from 'node:crypto';
import { renderToReadableStream } from 'react-dom/server.browser';
import { Outlet, Redirect, RouterOptions, RouterProvider, Serializer } from 'react-corsair';
import { createMemoryHistory, HistoryOptions, HistoryProvider } from 'react-corsair/history';
import { Manifest, ManifestProvider } from '../useManifest.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime';
import { ExecutorManagerProvider } from 'react-executor';
import { SSRExecutorManager } from 'react-executor/ssr';
import { SSRRouter } from 'react-corsair/ssr';
import { createReactChunkInjector } from './createReactChunkInjector.js';
import { ScriptInjectorProvider } from '../useScriptInjector.js';
import { Writable } from 'stream';

export interface MegaStackServerOptions<Context> extends RouterOptions<Context>, HistoryOptions {
  manifest: Manifest;
  serializer?: Serializer;
  rootComponent?: ComponentType;
  staticDir?: string;
}

export function createMegaStackServer<Context>(options: MegaStackServerOptions<Context>): Server {
  const { basePathname = '/', manifest, rootComponent: Root = Outlet, staticDir, serializer } = options;

  const bootstrapModules = manifest.bootstrapChunks.filter(chunk => chunk.type === 'js').map(chunk => chunk.url);

  return createServer((request, response) => {
    const { url = basePathname } = request;

    if (url === '/.well-known/appspecific/com.chrome.devtools.json') {
      response.writeHead(404);
      response.end();
      return;
    }

    if (staticDir !== undefined) {
      try {
        const assetPath = path.join(staticDir, new URL(url, 'https://0.0.0.0').pathname);
        const buffer = fs.readFileSync(assetPath);
        const assetMime = mime.getType(assetPath) || 'application/octet-stream';

        response.writeHead(200, { 'Content-Type': assetMime + '; charset=utf-8' });
        response.end(buffer);
        return;
      } catch {}
    }

    const abortController = new AbortController();

    const nonce = randomUUID();

    const executorManager = new SSRExecutorManager();

    const history = createMemoryHistory([url], { basePathname });

    const router = new SSRRouter({ ...options, nonce, serializer });

    const handleRedirect = (redirect: Redirect) => {
      const url = history.toAbsoluteURL(redirect.to);

      if (response.headersSent) {
        scriptInjector(`window.location.replace(${JSON.stringify(url)});`);
        return;
      }
      response.statusCode = 302;
      response.setHeader('Location', url);
      response.end();
      abortController.abort(redirect);
    };

    router.subscribe(event => {
      switch (event.type) {
        case 'not_found':
          if (response.headersSent) {
            break;
          }
          response.statusCode = 404;
          break;

        case 'redirect':
          handleRedirect(new Redirect(event.to));
          break;
      }
    });

    router.navigate(history.location);

    const chunkInjector = createReactChunkInjector(
      () => executorManager.nextHydrationChunk() + router.nextHydrationChunk()
    );

    const scriptInjector = (source: string) => chunkInjector.inject(`<script nonce="${nonce}">${source}</script>`);

    const headersInjector = new TransformStream({
      transform(chunk, controller) {
        if (!response.headersSent) {
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        controller.enqueue(chunk);
      },
    });

    if (abortController.signal.aborted) {
      return;
    }

    renderToReadableStream(
      <HistoryProvider value={history}>
        <RouterProvider value={router}>
          <ExecutorManagerProvider value={executorManager}>
            <ManifestProvider value={manifest}>
              <ScriptInjectorProvider value={scriptInjector}>
                <Root />
              </ScriptInjectorProvider>
            </ManifestProvider>
          </ExecutorManagerProvider>
        </RouterProvider>
      </HistoryProvider>,
      {
        nonce,
        bootstrapModules,
        signal: abortController.signal,
        onError(error) {
          if (error instanceof Redirect) {
            handleRedirect(error);
          }
        },
      }
    )
      .then(stream => stream.pipeThrough(headersInjector).pipeThrough(chunkInjector).pipeTo(Writable.toWeb(response)))
      .catch(error => console.log(error));
  });
}
