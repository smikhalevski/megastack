import React, { ReactNode } from 'react';
import { useRoute } from 'react-corsair';
import { productDetailsRoute } from '../routes.js';
import { useExecutor, useExecutorSuspense } from 'react-executor';

export default function ProductDetailsPage(): ReactNode {
  const { params } = useRoute(productDetailsRoute);

  console.log('Rendering ProductDetailsPage');

  const productDetails = useExecutorSuspense(
    useExecutor(['productDetails', params.id], () => loadProductDetails(params.id))
  ).get();

  return <p>{'Product details: ' + JSON.stringify(productDetails)}</p>;
}

function loadProductDetails(productId: string) {
  return new Promise(resolve => {
    console.log('Loading product details');

    setTimeout(resolve, 3000, { id: productId, description: 'CoolProductDescription' });
  });
}
