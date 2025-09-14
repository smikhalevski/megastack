import React, { ReactNode } from 'react';
import * as Messages from '@mfml/messages';
import { Message } from 'mfml/react';

export default function LoadingPage(): ReactNode {
  return (
    <p>
      <Message message={Messages.loadingHeading} />
    </p>
  );
}
