import { createRoute } from 'react-corsair';
import * as d from 'doubter';
import { getRepositoryExecutor } from './executors.js';
import { ExecutorManager } from 'react-executor';

export const repositoriesRoute = createRoute({
  pathname: '/',
  lazyComponent: () => import('./repositories/RepositoriesPage.js'),
});

export const repositoryRoute = createRoute<{ slug: string }, void, { executorManager: ExecutorManager }>({
  pathname: '/repository/:slug*',
  lazyComponent: () => import('./repositories/RepositoryPage.js'),
  paramsAdapter: d.object({
    slug: d.string(),
  }),

  dataLoader(options) {
    // Creating an executor fetches a repository
    getRepositoryExecutor(options.router.context.executorManager, options.params.slug);
  },
});

export const repositoryInfoRoute = createRoute(repositoryRoute, {
  lazyComponent: () => import('./repositories/RepositoryInfoPage.js'),
});
