import './index.css';
import { renderClient } from 'megastack';
import { routes } from './app/routes.js';
import { App } from './app/App.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import React from 'react';
import { createBrowserHistory, jsonSearchParamsSerializer } from 'react-corsair/history';
import { ExecutorManager } from 'react-executor';
import { Router } from 'react-corsair';
import { executorKeyIdGenerator, ssrStateSerializer } from './shared.js';

const executorManager = new ExecutorManager({
  keyIdGenerator: executorKeyIdGenerator,
});

const history = createBrowserHistory({
  searchParamsSerializer: jsonSearchParamsSerializer,
});

const router = new Router({
  routes,
  context: {
    executorManager,
  },
  loadingComponent: LoadingPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});

renderClient({
  executorManager,
  history,
  router,
  isHydrated: document.documentElement.getAttribute('data-static') === null,
  serializer: ssrStateSerializer,
  children: <App />,
});
