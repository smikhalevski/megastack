import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { feedRoute } from './routes.js';
import { Page } from '../components/page/Page.js';

export default function NotFoundPage(): ReactNode {
  return (
    <Page>
      <Link to={feedRoute}>{'Go back to Feed'}</Link>
    </Page>
  );
}
