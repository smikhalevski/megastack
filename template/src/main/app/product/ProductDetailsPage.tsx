import React, { ReactNode } from 'react';
import { useRoute } from 'react-corsair';
import { productDetailsRoute } from '../routes.js';
import { useExecutor, useExecutorSuspense } from 'react-executor';
import { Page } from '../../components/page/Page.js';

export default function ProductDetailsPage(): ReactNode {
  const { params } = useRoute(productDetailsRoute);

  console.log('Rendering ProductDetailsPage');

  const productDetails = useExecutorSuspense(
    useExecutor(['productDetails', params.id], () => loadProductDetails(params.id))
  ).get();

  return (
    <Page>
      <p>{'Product details: ' + JSON.stringify(productDetails)}</p>
    </Page>
  );
}

function loadProductDetails(productId: string) {
  return new Promise(resolve => {
    console.log('Loading product details');

    setTimeout(resolve, 1000, { id: productId, description: 'CoolProductDescription' });
  });
}
