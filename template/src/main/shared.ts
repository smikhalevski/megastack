import JSONMarshal, { createSerializer } from 'json-marshal';
import { jsonSearchParamsSerializer } from 'react-corsair/history';
import { jsonCookieSerializer } from 'whoopie';
import * as routes from './app/routes.js';

export const ssrStateSerializer = JSONMarshal;

export const cookieSerializer = jsonCookieSerializer;

export const searchParamsSerializer = jsonSearchParamsSerializer;

export const stableKeyIdGenerator = createSerializer({ isStable: true }).stringify;

export const navigableRoutes = [routes.repositoriesRoute, routes.repositoryInfoRoute];
