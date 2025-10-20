#!/usr/bin/env node
import * as path from 'node:path';
import { echo } from './echo.js';
import { echoError, echoHelp } from './utils.js';
import { initProject } from './initProject.js';

echo.isColorized = process.stdout.isTTY && process.env.FORCE_COLOR !== '0';

export type CLIOptions = typeof cliOptions;

const cliOptions = {
  packageManager: 'npm',
  packageName: 'template',
  outDir: process.cwd(),
  isForced: false,
};

for (let i = 3; i < process.argv.length; ++i) {
  switch (process.argv[i]) {
    case '--packageManager':
      cliOptions.packageManager = process.argv[++i];
      break;

    case '--packageName':
      cliOptions.packageName = process.argv[++i];
      break;

    case '--outDir':
      cliOptions.outDir = path.resolve(process.argv[++i]);
      break;

    case '--force':
      cliOptions.isForced = true;
      break;

    case '--silent':
      echo.isSilent = true;
      break;

    case '--color':
      echo.isColorized = true;
      break;

    case '--help':
      echo.isSilent = false;
      echoHelp();
      process.exit();
  }
}

try {
  switch (process.argv[2]) {
    case 'init':
      await initProject(path.join(import.meta.dirname, '../template'), cliOptions);
      break;

    default:
      echoHelp();
      break;
  }
} catch (error) {
  echoError(error);
  process.exit(1);
}
