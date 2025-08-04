import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { productRoute } from '../routes.js';
import { Page } from '../../components/page/Page.js';

export default function FeedPage(): ReactNode {
  return (
    <Page>
      <Link to={productRoute.getLocation({ id: '222' })}>{'Go to product 222'}</Link>
    </Page>
  );
}
