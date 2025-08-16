import React, { ReactNode } from 'react';
import { useRoute } from 'react-corsair';

export default function ErrorPage(): ReactNode {
  const { error } = useRoute();

  return (
    <>
      <h1>{'An error occurred'}</h1>

      <pre>{error instanceof Error ? error.stack : String(error)}</pre>
    </>
  );
}
