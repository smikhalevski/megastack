#!/usr/bin/env node

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
// @ts-ignore
import megastackPackageJSON from '../package.json' with { type: 'json' };
import { parseArgs } from 'argcat';
import * as d from 'doubter';

const argsShape = d.object({
  packageManager: d.string().coerce().optional('npm'),

  packageName: d.string().coerce().optional(),

  outputDir: d.string().coerce().optional(process.cwd()),

  force: d.boolean().optional(false),

  silent: d.boolean().optional(false),

  help: d.boolean().optional(false),

  '': d.array(d.string()),
});

const args = argsShape.parse(parseArgs(process.argv.slice(2), { flags: ['force', 'silent', 'help'] }));

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../template');
const OUTPUT_DIR = path.resolve(args.outputDir);
const PACKAGE_MANAGER = args.packageManager;
const PACKAGE_NAME = args.packageName || path.basename(OUTPUT_DIR);
const IS_SILENT = args.silent;
const IS_HELP = args.help;
const IS_FORCE = args.force;

const LOGO = `
▄▄ ▄  ▄▄▄ ▄▄▄  ▄ 
█ █ █ █▄  █ ▄ █▄█
█ █ █ █▄▄ █▄▀ █ █
`;

process.exit(await runCommand(args[''][0]));

async function runCommand(command: string): Promise<number> {
  if (IS_HELP) {
    return runHelpCommand();
  }

  switch (command) {
    case 'init':
      return runInitCommand();

    default:
      return runHelpCommand();
  }
}

async function runInitCommand(): Promise<number> {
  echo(LOGO);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  if (!IS_FORCE && (await fs.readdir(OUTPUT_DIR)).length !== 0) {
    echo(decorateError('The output directory must be empty.'));
    return 1;
  }

  const stepCount = 4;

  let stepIndex = 1;

  echo(decorateStep(stepIndex++, stepCount, 'Copying project files\n'));

  await fs.cp(TEMPLATE_DIR, OUTPUT_DIR, { recursive: true, force: IS_FORCE });

  process.chdir(OUTPUT_DIR);

  const packageJSON = JSON.parse(await fs.readFile('package.json', 'utf8'));

  packageJSON.name = PACKAGE_NAME;
  packageJSON.dependencies.megastack = '^' + megastackPackageJSON.version;

  await fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));

  echo(decorateStep(stepIndex++, stepCount, 'Installing dependencies'));

  execSync(PACKAGE_MANAGER + ' install --no-fund', { stdio: IS_SILENT ? 'ignore' : 'inherit' });

  echo('\n' + decorateStep(stepIndex++, stepCount, 'Building project\n'));

  execSync(PACKAGE_MANAGER + ' run --silent build', { stdio: IS_SILENT ? 'ignore' : 'inherit' });

  echo(`
${decorateStep(stepIndex++, stepCount, 'Project is ready')}

See ${decorateLink('https://megastack.dev')} for API docs and tutorials.

Install Devtools ${decorateLink('https://megastack.dev/react-executor#devtools')} extension for Chrome.

Run ${decorateCmd(PACKAGE_MANAGER + ' run dev')} to start the dev server with hot reload.

Run ${decorateCmd(PACKAGE_MANAGER + ' run build')} to build the project.

Run ${decorateCmd(PACKAGE_MANAGER + ' run preview')} to start the static site server.

Run ${decorateCmd(PACKAGE_MANAGER + ' run preview-ssr')} to start the SSR server.
`);

  return 0;
}

function runHelpCommand(): number {
  console.log(`${LOGO}
Initialize a new MegaStack project.


${decorateHeader('USAGE')}

${decorateCmd('megastack init')} [...options]


${decorateHeader('OPTIONS')}

${decorateCmd('--packageManager')}  Package manager for installing dependencies.
                  Default: npm

   ${decorateCmd('--packageName')}  Project package name.

     ${decorateCmd('--outputDir')}  Directory to output the project.

         ${decorateCmd('--force')}  Overwrite existing files.

        ${decorateCmd('--silent')}  Mute all output.

          ${decorateCmd('--help')}  Print this message.


See ${decorateLink('https://megastack.dev')} for API docs and tutorials.`);

  return 0;
}

function echo(message: string): void {
  if (!IS_SILENT) {
    console.log(message);
  }
}

function decorateLink(url: string): string {
  return chalk.blue.underline(url);
}

function decorateError(message: string): string {
  return chalk.bgRed.white(' ERROR ') + ' ' + message;
}

function decorateStep(stepIndex: number, stepCount: number, message: string): string {
  return chalk.dim.inverse(` ${stepIndex}/${stepCount} `) + ' ' + chalk.bold(message);
}

function decorateHeader(message: string): string {
  return chalk.bold(message);
}

function decorateCmd(cmd: string): string {
  return chalk.dim(cmd);
}
