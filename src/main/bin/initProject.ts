import fs from 'node:fs/promises';
import { echoLogo, formatLink, formatStep } from './utils.js';
import { dim, echo } from './echo.js';
import { execSync } from 'node:child_process';
import type { CLIOptions } from './megastack.js';

export async function initProject(templateDir: string, options: CLIOptions): Promise<void> {
  const { packageManager, packageName, outDir, isForced } = options;

  echoLogo();

  await fs.mkdir(outDir, { recursive: true });

  if (!isForced && (await fs.readdir(outDir)).length !== 0) {
    throw new Error('The output directory must be empty.');
  }

  const stepCount = 4;

  let stepIndex = 1;

  echo(formatStep(stepIndex++, stepCount, 'Copying project files\n'));

  await fs.cp(templateDir, outDir, { recursive: true, force: isForced });

  process.chdir(outDir);

  const packageJSON = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const megastackPackageJSON = JSON.parse(await fs.readFile('../package.json', 'utf8'));

  packageJSON.name = packageName;
  packageJSON.dependencies.megastack = '^' + megastackPackageJSON.version;

  await fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));

  echo(formatStep(stepIndex++, stepCount, 'Installing dependencies'));

  execSync(packageManager + ' install --no-fund', { stdio: echo.isSilent ? 'ignore' : 'inherit' });

  echo('\n' + formatStep(stepIndex++, stepCount, 'Building project\n'));

  execSync(packageManager + ' run --silent build', { stdio: echo.isSilent ? 'ignore' : 'inherit' });

  echo(`
${formatStep(stepIndex++, stepCount, 'Project is ready')}

See ${formatLink('https://megastack.dev')} for API docs and tutorials.

Install Devtools ${formatLink('https://megastack.dev/react-executor#devtools')} extension for Chrome.

Run ${dim(packageManager + ' run dev')} to start the dev server with hot reload.

Run ${dim(packageManager + ' run build')} to build the project.

Run ${dim(packageManager + ' run preview')} to start the static site server.

Run ${dim(packageManager + ' run preview-ssr')} to start the SSR server.
`);
}
