import React, { ReactNode, Suspense } from 'react';
import { Message } from 'mfml/react';
import { Link, useHistory } from 'react-corsair/history';
import * as routes from '../routes.js';
import { useNumberFormat } from 'react-hookers';
import css from './RepositoriesPage.module.css';
import { useRepositories } from '../executors.js';
import { RouteOutlet, useInterceptedRoute, useRouter } from 'react-corsair';
import { ModalDialog } from '../../components/dialog/ModalDialog.js';
import * as Messages from '@mfml/messages';

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
          buttons={
            <button onClick={() => router.cancelInterception()}>
              <Message message={Messages.showFullPage} />
            </button>
          }
        >
          <Suspense
            fallback={
              <p>
                <Message message={Messages.repositoryInfoLoading} />
              </p>
            }
          >
            <RouteOutlet controller={repositoryInfoRouteController} />
          </Suspense>
        </ModalDialog>
      )}

      <h1>
        <Message
          message={Messages.repositoriesHeading}
          values={{ count: repositories.length }}
        />
      </h1>

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
