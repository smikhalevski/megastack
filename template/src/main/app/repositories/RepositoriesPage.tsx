import React, { ReactNode, Suspense } from 'react';
import { Link, useHistory } from 'react-corsair/history';
import * as routes from '../routes.js';
import { useNumberFormat } from 'react-hookers';
import css from './RepositoriesPage.module.css';
import { useRepositories } from '../executors.js';
import { RouteOutlet, useInterceptedRoute, useRouter } from 'react-corsair';
import { ModalDialog } from '../../components/dialog/ModalDialog.js';

export default function RepositoriesPage(): ReactNode {
  const repositoryInfoRouteController = useInterceptedRoute(routes.repositoryInfoRoute);
  const history = useHistory();
  const router = useRouter();
  const numberFormat = useNumberFormat();
  const repositories = useRepositories();

  return (
    <>
      {repositoryInfoRouteController !== null && (
        <ModalDialog
          onClose={() => history.back()}
          buttons={<button onClick={() => router.cancelInterception()}>{'Show full page'}</button>}
        >
          <Suspense fallback={<p>{'Loading repository info…'}</p>}>
            <RouteOutlet controller={repositoryInfoRouteController} />
          </Suspense>
        </ModalDialog>
      )}

      <h1>{'Repositories'}</h1>

      {repositories.map(repository => (
        <Link
          key={repository.id}
          className={css.RepositoryLink}
          to={routes.repositoryInfoRoute.getLocation({ slug: repository.full_name })}
          prefetch={'hovered'}
        >
          {repository.name}
          <br />
          {'★ ' + numberFormat.format(repository.stargazers_count)}
        </Link>
      ))}
    </>
  );
}
