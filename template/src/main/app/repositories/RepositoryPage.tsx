import React, { ReactNode, Suspense } from 'react';
import { Outlet, useRoute } from 'react-corsair';
import * as routes from '../routes.js';
import { Link } from 'react-corsair/history';
import { useRepository, useStargazers } from '../executors.js';
import { User } from '../../components/avatar/User.js';
import css from './RepositoryPage.module.css';
import { Message } from 'mfml/react';
import * as Messages from '@mfml/messages';

export default function RepositoryPage(): ReactNode {
  const routeController = useRoute(routes.repositoryRoute);
  const repository = useRepository(routeController.params.slug);

  return (
    <>
      <p>
        <Link to={routes.repositoriesRoute}>
          <Message message={Messages.goToRepositories} />
        </Link>
      </p>

      <Outlet />

      <h2>
        <Message message={Messages.topicsHeading} />
      </h2>

      <div className={css.Topics}>
        {repository.topics.map(topic => (
          <span
            key={topic}
            className={css.Topic}
          >
            {topic}
          </span>
        ))}
      </div>

      <h2>
        <Message message={Messages.stargazersHeading} />
      </h2>

      <Suspense fallback={<Message message={Messages.stargazersLoading} />}>
        <Stargazers />
      </Suspense>
    </>
  );
}

function Stargazers(): ReactNode {
  const routeController = useRoute(routes.repositoryRoute);
  const stargazers = useStargazers(routeController.params.slug);

  return (
    <div className={css.Stargazers}>
      {stargazers.map(user => (
        <User
          key={user.id}
          user={user}
        />
      ))}
    </div>
  );
}
