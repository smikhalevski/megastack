#!/usr/bin/env node

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
// @ts-ignore
import megastackPackageJSON from '../package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);

if (argv.length === 0 || argv[0] !== 'init') {
  console.log(`Create a MegaStack project in the current directory

Usage:
megastack init [[@scope/]<package-name>]`);

  process.exit(0);
}

const TARGET_DIR = process.cwd();

if ((await fs.readdir(TARGET_DIR)).length !== 0) {
  logError(`The directory must be empty.`);
  process.exit(1);
}

console.log(
  chalk.inverse(`
 ▄▄ ▄  ▄▄▄ ▄▄▄  ▄  
 █ █ █ █▄  █ ▄ █▄█ 
 █ █ █ █▄▄ █▄▀ █ █ 
                   
`)
);

logInfo('Copying project files\n');

await fs.cp(path.join(__dirname, '../template'), TARGET_DIR, { recursive: true });

const packageJSON = JSON.parse(await fs.readFile('package.json', 'utf8'));

packageJSON.dependencies.megastack = '^' + megastackPackageJSON.version;

if (argv[1] !== undefined) {
  packageJSON.name = argv[1];
}

await fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));

logInfo('Installing dependencies');

execSync('npm install --no-fund', { stdio: 'inherit' });

logInfo('\nBuilding project');

execSync('npm run build', { stdio: 'inherit' });

console.log(`
${chalk.bold.green('Project created')}

Run ${chalk.bold.white('`npm run dev`')} to start the dev server with hot reload.

Run ${chalk.bold.white('`npm run build`')} to build the project.

Run ${chalk.bold.white('`npm run preview`')} to start the preview server of the static site.

Run ${chalk.bold.white('`npm run preview-ssr`')} to start the preview server with SSR.
`);

function logError(message: string): void {
  console.log(chalk.bgRed.white(' ERROR ') + ' ' + message);
}

function logInfo(message: string): void {
  console.log(chalk.bold.blue(message));
}
