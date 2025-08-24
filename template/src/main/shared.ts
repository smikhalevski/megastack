import JSONMarshal, { createSerializer } from 'json-marshal';
import * as routes from './app/routes.js';

export const ssrStateSerializer = JSONMarshal;

export const stableKeyIdGenerator = createSerializer({ isStable: true }).stringify;

export const navigableRoutes = [routes.repositoriesRoute, routes.repositoryInfoRoute];
