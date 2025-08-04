import React, { ReactNode } from 'react';
import { Outlet } from 'react-corsair';
import { useManifest } from 'megastack';

export function Root(): ReactNode {
  const manifest = useManifest();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon-light.ico"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon-dark.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon-light.ico"
          media="(prefers-color-scheme: light)"
        />

        {manifest.bootstrapChunks
          .filter(chunk => chunk.type === 'css')
          .map(chunk => (
            <link
              key={chunk.url}
              rel="text/css"
              crossOrigin="anonymous"
              href={chunk.url}
            />
          ))}
      </head>
      <Outlet />
    </html>
  );
}
