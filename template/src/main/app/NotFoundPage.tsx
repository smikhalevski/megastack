import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import * as routes from './routes.js';

export default function NotFoundPage(): ReactNode {
  return (
    <>
      <p>
        <Link to={routes.repositoriesRoute}>{'← Go to repositories'}</Link>
      </p>

      <h1>{'Not found'}</h1>
    </>
  );
}
