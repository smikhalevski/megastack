import { createRoute } from 'react-corsair';

export const repositoriesRoute = createRoute({
  pathname: '/',
  lazyComponent: () => import('./repositories/RepositoriesPage.js'),
});

export const repositoryRoute = createRoute<{ slug: string }>({
  pathname: '/repository/:slug*',
  lazyComponent: () => import('./repositories/RepositoryPage.js'),
});

export const repositoryInfoRoute = createRoute(repositoryRoute, {
  lazyComponent: () => import('./repositories/RepositoryInfoPage.js'),
});

export const routes = [repositoriesRoute, repositoryInfoRoute];
