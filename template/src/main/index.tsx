import './index.css';
import { startClient } from 'megastack';
import { routes } from './app/routes.js';
import { App } from './app/App.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import JSONMarshal from 'json-marshal';
import React from 'react';
import { createBrowserHistory, jsonSearchParamsSerializer } from 'react-corsair/history';
import { ExecutorManager } from 'react-executor';
import { Router } from 'react-corsair';

const executorManager = new ExecutorManager();

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

startClient({
  executorManager,
  history,
  router,
  isHydrated: document.documentElement.getAttribute('data-static') === null,
  serializer: JSONMarshal,
  children: <App />,
});
