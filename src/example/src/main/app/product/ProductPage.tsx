import { ReactNode } from 'react';
import { Outlet, useRoute } from 'react-corsair';
import { feedRoute, productDetailsRoute, productRoute } from '../routes.js';
import { useExecutor, useExecutorSuspense } from 'react-executor';
import React from 'react';
import { Link } from 'react-corsair/history';

export default function ProductPage(): ReactNode {
  const { params } = useRoute(productRoute);

  console.log('Rendering ProductPage');

  const product = useExecutorSuspense(useExecutor(['product', params.id], () => loadProduct(params.id))).get();

  return (
    <>
      <p>
        <Link to={feedRoute}>{'Go to Feed'}</Link>
      </p>
      <p>{'Product: ' + JSON.stringify(product)}</p>
      <Outlet fallback={<Link to={productDetailsRoute.getLocation({ id: params.id })}>{'Show details'}</Link>} />
    </>
  );
}

function loadProduct(productId: string) {
  return new Promise(resolve => {
    console.log('Loading product');

    setTimeout(resolve, 3000, { id: productId, title: 'CoolProduct' });
  });
}
