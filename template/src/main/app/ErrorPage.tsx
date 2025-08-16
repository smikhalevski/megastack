import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { repositoriesRoute } from './routes.js';
import { useRoute } from 'react-corsair';

export default function ErrorPage(): ReactNode {
  const { error } = useRoute();

  return (
    <>
      <p>
        <Link to={repositoriesRoute}>{'← Go to repositories'}</Link>
      </p>

      <h1>{'An error occurred'}</h1>

      <pre>{error instanceof Error ? error.stack : String(error)}</pre>
    </>
  );
}
