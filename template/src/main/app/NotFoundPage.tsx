import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import * as routes from './routes.js';
import * as Messages from '@mfml/messages';
import { Message } from 'mfml/react';

export default function NotFoundPage(): ReactNode {
  return (
    <>
      <p>
        <Link to={routes.repositoriesRoute}>
          <Message message={Messages.goToRepositories} />
        </Link>
      </p>

      <h1>
        <Message message={Messages.notFoundHeading} />
      </h1>
    </>
  );
}
