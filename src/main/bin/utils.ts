import { bgRed, blue, bold, dim, echo, inverse, underline, white } from './echo.js';

export function echoLogo(): void {
  echo(`
▄▄ ▄  ▄▄▄ ▄▄▄  ▄ 
█ █ █ █▄  █ ▄ █▄█
█ █ █ █▄▄ █▄▀ █ █
`);
}

export function echoHelp(): void {
  echoLogo();
  echo(`
megastack init: Initialize a new Megastack project.

${dim('megastack init')} [...options]

${dim('--packageManager')}  Package manager for installing dependencies.
                  Default: npm

   ${dim('--packageName')}  Project package name.

        ${dim('--outDir')}  Directory to output the project.

         ${dim('--force')}  Overwrite existing files.

        ${dim('--silent')}  Mute all output.
        
         ${dim('--color')}  Force colorized output.

          ${dim('--help')}  Print this message.


See ${formatLink('https://megastack.dev')} for API docs and tutorials.`);
}

export function echoError(error: unknown): void {
  return echo(bgRed(white(' ERROR ')) + ' ' + (error instanceof Error ? error.message : error));
}

export function formatLink(url: string): string {
  return blue(underline(url));
}

export function formatStep(stepIndex: number, stepCount: number, message: string): string {
  return dim(inverse(` ${stepIndex}/${stepCount} `)) + ' ' + bold(message);
}
