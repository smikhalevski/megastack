import React, { ComponentType, StrictMode } from 'react';
import { createServer, Server } from 'node:http';
import { randomUUID } from 'node:crypto';
import { renderToPipeableStream } from 'react-dom/server';
import { Outlet, RouterOptions, RouterProvider, Serializer } from 'react-corsair';
import { createMemoryHistory, HistoryOptions, HistoryProvider } from 'react-corsair/history';
import { NodeSSRRouter } from 'react-corsair/ssr/node';
import { Manifest, ManifestProvider } from '../useManifest.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import mime from 'mime';
import { NodeSSRExecutorManager } from 'react-executor/ssr/node';
import { ExecutorManagerProvider } from 'react-executor';

export interface PipeableServer<Context> extends RouterOptions<Context>, HistoryOptions {
  manifest: Manifest;
  serializer?: Serializer;
  rootComponent?: ComponentType;
  staticDir?: string;
}

export function createPipeableServer<Context>(options: PipeableServer<Context>): Server {
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

    const nonce = randomUUID();

    const executorManager = new NodeSSRExecutorManager();

    const history = createMemoryHistory([url], { basePathname });

    const router = new NodeSSRRouter({ ...options, nonce, serializer });

    router.subscribe(event => {
      switch (event.type) {
        case 'not_found':
          if (response.headersSent) {
            return;
          }
          response.statusCode = 404;
          break;

        case 'redirect':
          if (response.headersSent) {
            return;
          }
          response.writeHead(302, {
            Location: history.toAbsoluteURL(event.to),
          });
          response.end();
          break;
      }
    });

    router.navigate(history.location);

    const handleShellReady = () => {
      if (response.headersSent) {
        stream.abort(new Error('Headers already sent'));
        return;
      }

      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

      stream.pipe(executorManager.stream).pipe(router.stream).pipe(response);
    };

    const stream = renderToPipeableStream(
      <StrictMode>
        <HistoryProvider value={history}>
          <RouterProvider value={router}>
            <ExecutorManagerProvider value={executorManager}>
              <ManifestProvider value={manifest}>
                <Root />
              </ManifestProvider>
            </ExecutorManagerProvider>
          </RouterProvider>
        </HistoryProvider>
      </StrictMode>,
      {
        nonce,
        bootstrapModules,
        onShellReady: handleShellReady,
      }
    );
  });
}
