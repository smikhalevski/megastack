import React, { ReactNode, StrictMode } from 'react';
import { Outlet } from 'react-corsair';
import { MessageLocaleProvider } from 'mfml/react';
import { useLocale } from './executors.js';

export function App(): ReactNode {
  const [locale, setLocale] = useLocale();

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
        <select
          value={locale}
          onChange={event => setLocale(event.target.value)}
        >
          <option value={'en-US'}>{'English'}</option>
          <option value={'ru-RU'}>{'Русский'}</option>
        </select>

        <StrictMode>
          <MessageLocaleProvider value={locale}>
            <Outlet />
          </MessageLocaleProvider>
        </StrictMode>
      </body>
    </html>
  );
}
