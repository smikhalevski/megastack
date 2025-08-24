import React, { ReactNode } from 'react';
import { useRoute } from 'react-corsair';
import * as routes from '../routes.js';
import { useRepository } from '../executors.js';
import { useNumberFormat } from 'react-hookers';
import { User } from '../../components/avatar/User.js';

export default function RepositoryInfoPage(): ReactNode {
  const numberFormat = useNumberFormat();
  const routeController = useRoute(routes.repositoryRoute);
  const repository = useRepository(routeController.params.slug);

  return (
    <>
      <h1>{repository.name}</h1>

      <User user={repository.owner} />

      <p>{repository.description}</p>

      <p>{repository.language}</p>

      <p>{'★ ' + numberFormat.format(repository.stargazers_count)}</p>
    </>
  );
}
