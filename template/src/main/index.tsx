import './index.css';
import { renderClient } from 'megastack';
import { App } from './app/App.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import React from 'react';
import { createBrowserHistory, jsonSearchParamsSerializer } from 'react-corsair/history';
import { ExecutorManager } from 'react-executor';
import { Router } from 'react-corsair';
import { navigableRoutes, ssrStateSerializer, stableKeyIdGenerator } from './shared.js';

const executorManager = new ExecutorManager({
  keyIdGenerator: stableKeyIdGenerator,
});

const history = createBrowserHistory({
  searchParamsSerializer: jsonSearchParamsSerializer,
});

history.start();

const router = new Router({
  routes: navigableRoutes,
  context: {
    executorManager,
  },
  loadingComponent: LoadingPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});

router.subscribe(event => {
  if (event.type === 'navigate' && !event.isIntercepted && event.prevLocation.pathname !== event.location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
});

renderClient({
  executorManager,
  history,
  router,
  isHydrated: document.documentElement.getAttribute('data-static') === null,
  serializer: ssrStateSerializer,
  children: <App />,
});
