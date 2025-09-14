import React, { ReactNode } from 'react';
import { useRoute } from 'react-corsair';
import * as Messages from '@mfml/messages';
import { Message } from 'mfml/react';

export default function ErrorPage(): ReactNode {
  const { error } = useRoute();

  return (
    <>
      <h1>
        <Message message={Messages.errorHeading} />
      </h1>

      <pre>{error instanceof Error ? error.stack : String(error)}</pre>
    </>
  );
}
