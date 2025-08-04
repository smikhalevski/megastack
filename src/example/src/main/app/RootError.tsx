import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { feedRoute } from './routes.js';
import { useRoute } from 'react-corsair';

export default function RootError(): ReactNode {
  const { error } = useRoute();

  return (
    <p>
      <h1>{'An error occurred'}</h1>
      <pre>{error.toString()}</pre>
      <Link to={feedRoute}>{'Go back to Feed'}</Link>
    </p>
  );
}
