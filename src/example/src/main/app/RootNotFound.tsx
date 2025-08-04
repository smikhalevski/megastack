import React, { ReactNode } from 'react';
import { Link } from 'react-corsair/history';
import { feedRoute } from './routes.js';

export default function RootNotFound(): ReactNode {
  return <Link to={feedRoute}>{'Go back to Feed'}</Link>;
}
