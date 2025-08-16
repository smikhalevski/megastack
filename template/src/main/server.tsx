import * as fs from 'node:fs';
import React from 'react';
import JSONMarshal from 'json-marshal';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { isBot, parseViteManifest, renderToResponse } from 'megastack/ssr';
import { createMemoryHistory, jsonSearchParamsSerializer } from 'react-corsair/history';
import { SSRRouter } from 'react-corsair/ssr';
import { SSRExecutorManager } from 'react-executor/ssr';
import { routes } from './app/routes.js';
import { App } from './app/App.js';
import LoadingPage from './app/LoadingPage.js';
import NotFoundPage from './app/NotFoundPage.js';
import ErrorPage from './app/ErrorPage.js';

const { bootstrapModules, prefetchModules, bootstrapCSS } = parseViteManifest(
  '/',
  JSON.parse(fs.readFileSync('manifest.json', 'utf-8'))
);

const app = new Hono();

app.use(serveStatic({ root: 'public', index: 'none' }));

app.get('/.well-known/*', c => c.notFound());

app.get('/*', c => {
  const nonce = crypto.randomUUID();

  const executorManager = new SSRExecutorManager({
    nonce,
    serializer: JSONMarshal,
  });

  const history = createMemoryHistory([c.req.url.substring(new URL(c.req.url).origin.length)], {
    searchParamsSerializer: jsonSearchParamsSerializer,
  });

  const router = new SSRRouter({
    nonce,
    routes,
    context: {
      executorManager,
    },
    serializer: JSONMarshal,
    loadingComponent: LoadingPage,
    notFoundComponent: NotFoundPage,
    errorComponent: ErrorPage,
  });

  return renderToResponse({
    history,
    router,
    executorManager,
    nonce,
    bootstrapModules,
    bootstrapCSS,
    prefetchModules,
    isBot: isBot(c.req.header('User-Agent')),
    signal: c.req.raw.signal,
    children: <App />,
  });
});

serve(app);
