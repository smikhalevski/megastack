import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { feedRoute } from './routes.js';
import { useRoute } from 'react-corsair';
import { Page } from '../components/page/Page.js';

export default function ErrorPage(): ReactNode {
  const { error } = useRoute();

  return (
    <Page>
      <h1>{'An error occurred'}</h1>
      <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      <Link to={feedRoute}>{'Go back to Feed'}</Link>
    </Page>
  );
}
