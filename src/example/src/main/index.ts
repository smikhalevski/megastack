import './index.css';
import { startClient } from 'megastack';
import { routes } from './app/routes.js';
import { Root } from './app/Root.js';
import RootNotFound from './app/RootNotFound.js';
import RootLoading from './app/RootLoading.js';
import RootError from './app/RootError.js';

startClient({
  routes,
  isHydrated: import.meta.env.PROD,
  rootComponent: Root,
  loadingComponent: RootLoading,
  notFoundComponent: RootNotFound,
  errorComponent: RootError,
});
