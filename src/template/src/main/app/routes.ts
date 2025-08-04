import { createRoute } from 'react-corsair';

export const feedRoute = createRoute({
  pathname: '/',
  lazyComponent: () => import('./feed/FeedPage.js'),
});

export const productRoute = createRoute<{ id: string }, number>({
  pathname: '/product/:id',
  lazyComponent: () => import('./product/ProductPage.js'),
  dataLoader: () => {
    return new Promise(resolve => {
      console.log('Loading productRoute');

      setTimeout(resolve, 1000, 222);
    });
  },
});

export const productDetailsRoute = createRoute(productRoute, {
  pathname: '/details',
  lazyComponent: () => import('./product/ProductDetailsPage.js'),
  dataLoader: () => {
    return new Promise((resolve, reject) => {
      console.log('Loading productDetailsRoute');

      setTimeout(resolve, 2000, 222);
    });
  },
  loadingComponent: () => 'Loading product details',
});

export const routes = [feedRoute, productRoute, productDetailsRoute];
