import './index.css';
import { startMegaStackClient } from 'megastack';
import { routes } from './app/routes.js';
import { Root } from './app/Root.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import JSONMarshal from 'json-marshal';

startMegaStackClient({
  routes,
  isHydrated: document.documentElement.getAttribute('data-static') === null,
  serializer: JSONMarshal,
  rootComponent: Root,
  loadingComponent: LoadingPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
