import { createRoute } from 'react-corsair';
import * as d from 'doubter';

export const repositoriesRoute = createRoute({
  pathname: '/',
  lazyComponent: () => import('./repositories/RepositoriesPage.js'),
});

export const repositoryRoute = createRoute({
  pathname: '/repository/:slug*',
  lazyComponent: () => import('./repositories/RepositoryPage.js'),
  paramsAdapter: d.object({
    slug: d.string(),
  }),
});

export const repositoryInfoRoute = createRoute(repositoryRoute, {
  lazyComponent: () => import('./repositories/RepositoryInfoPage.js'),
});

export const routes = [repositoriesRoute, repositoryInfoRoute];
