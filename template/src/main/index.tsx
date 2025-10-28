import './index.css';
import { renderClient } from 'megastack';
import { App } from './app/App.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import React from 'react';
import { createBrowserHistory } from 'react-corsair/history';
import { ExecutorManager } from 'react-executor';
import { Router } from 'react-corsair';
import {
  cookieSerializer,
  navigableRoutes,
  searchParamsSerializer,
  ssrStateSerializer,
  stableKeyIdGenerator,
} from './shared.js';
import { enableDevtool } from 'mfml/react';
import { debugInfo } from '@mfml/messages/metadata';
import { createCookieStorage } from 'whoopie';
import { prepareLocaleExecutor } from './app/executors.js';

if (import.meta.env.DEV) {
  enableDevtool(debugInfo);
}

const executorManager = new ExecutorManager({
  keyIdGenerator: stableKeyIdGenerator,
});

const history = createBrowserHistory({
  searchParamsSerializer,
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

const cookieStorage = createCookieStorage({
  getCookie() {
    return document.cookie;
  },
  setCookie(cookie) {
    document.cookie = cookie;
  },
  serializer: cookieSerializer,
});

prepareLocaleExecutor(executorManager, cookieStorage, navigator.languages);

renderClient({
  executorManager,
  history,
  router,
  cookieStorage,
  isHydrated: document.documentElement.getAttribute('data-static') === null,
  serializer: ssrStateSerializer,
  children: <App />,
});
