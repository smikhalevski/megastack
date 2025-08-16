import React, { ReactNode, StrictMode } from 'react';
import { Outlet } from 'react-corsair';

export function App(): ReactNode {
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
      </head>
      <body>
        <StrictMode>
          <Outlet />
        </StrictMode>
      </body>
    </html>
  );
}
