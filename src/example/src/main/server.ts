import * as fs from 'node:fs';
import { createPipeableServer, parseViteManifest } from 'megastack/ssr';
import { routes } from './app/routes.js';
import { Root } from './app/Root.js';
import RootNotFound from './app/RootNotFound.js';
import RootLoading from './app/RootLoading.js';
import RootError from './app/RootError.js';

const server = createPipeableServer({
  routes,
  manifest: parseViteManifest(JSON.parse(fs.readFileSync('manifest.json', 'utf-8'))),
  staticDir: 'public',
  rootComponent: Root,
  loadingComponent: RootLoading,
  notFoundComponent: RootNotFound,
  errorComponent: RootError,
});

server.listen(8080);
