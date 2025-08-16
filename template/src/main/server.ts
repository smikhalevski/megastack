import * as fs from 'node:fs';
import { createMegaStackServer, parseViteManifest } from 'megastack/ssr';
import { routes } from './app/routes.js';
import { Root } from './app/Root.js';
import NotFoundPage from './app/NotFoundPage.js';
import LoadingPage from './app/LoadingPage.js';
import ErrorPage from './app/ErrorPage.js';
import JSONMarshal from 'json-marshal';

const server = createMegaStackServer({
  routes,
  manifest: parseViteManifest(JSON.parse(fs.readFileSync('manifest.json', 'utf-8'))),
  staticDir: 'public',
  serializer: JSONMarshal,
  rootComponent: Root,
  loadingComponent: LoadingPage,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});

server.listen(8080);
