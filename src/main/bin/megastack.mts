#!/usr/bin/env node

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
// @ts-ignore
import megastackPackageJSON from '../package.json' with { type: 'json' };

const argv = process.argv.slice(2);

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../template');

const TARGET_DIR = process.cwd();

const PROJECT_NAME = argv[1] !== undefined ? argv[1] : path.basename(TARGET_DIR);

const TOTAL_STEP_COUNT = 4;

let stepIndex = 1;

echo(`
▄▄ ▄  ▄▄▄ ▄▄▄  ▄ 
█ █ █ █▄  █ ▄ █▄█
█ █ █ █▄▄ █▄▀ █ █

`);

if (argv[0] !== 'init') {
  echo(`Creates a new project in the current directory.

Usage:
${decorateCmd('megastack init')} [<package-name>]

Go to ${decorateLink('https://megastack.dev')} for API docs and tutorials.
`);

  process.exit(0);
}

if ((await fs.readdir(TARGET_DIR)).length !== 0) {
  echo(decorateError('The directory must be empty.'));
  process.exit(1);
}

echo(decorateTitle(stepIndex++, TOTAL_STEP_COUNT, 'Copying project files\n'));

await fs.cp(TEMPLATE_DIR, TARGET_DIR, { recursive: true });

const packageJSON = JSON.parse(await fs.readFile('package.json', 'utf8'));

packageJSON.name = PROJECT_NAME;
packageJSON.dependencies.megastack = '^' + megastackPackageJSON.version;

await fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));

echo(decorateTitle(stepIndex++, TOTAL_STEP_COUNT, 'Installing dependencies'));

execSync('npm install --no-fund', { stdio: 'inherit' });

echo('\n' + decorateTitle(stepIndex++, TOTAL_STEP_COUNT, 'Building project\n'));

execSync('npm run --silent build', { stdio: 'inherit' });

echo(`
${decorateTitle(stepIndex++, TOTAL_STEP_COUNT, 'Project is ready')}

Go to ${decorateLink('https://megastack.dev')} for API docs and tutorials.

Install Devtools ${decorateLink('https://megastack.dev/react-executor#devtools')} extension for Chrome.

Run ${decorateCmd('npm run dev')} to start the dev server with hot reload.

Run ${decorateCmd('npm run build')} to build the project.

Run ${decorateCmd('npm run preview')} to start the static site server.

Run ${decorateCmd('npm run preview-ssr')} to start the SSR server.
`);

function echo(message: string): void {
  console.log(message);
}

function decorateLink(url: string): string {
  return chalk.blue.underline(url);
}

function decorateError(message: string): string {
  return chalk.bgRed.white(' ERROR ') + ' ' + message;
}

function decorateTitle(index: number, totalCount: number, message: string): string {
  return chalk.magenta.inverse(` ${index}/${totalCount} `) + ' ' + chalk.bold.magenta(message);
}

function decorateCmd(cmd: string): string {
  return chalk.bold(cmd);
}
