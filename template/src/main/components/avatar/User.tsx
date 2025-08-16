import React, { ReactNode } from 'react';
import { GitHub } from '../../app/executors.js';
import css from './User.module.css';

export interface UserProps {
  user: GitHub.User;
  avatarSize?: number;
}

export function User(props: UserProps): ReactNode {
  const { user, avatarSize } = props;

  return (
    <div className={css.User}>
      <img
        className={css.Avatar}
        src={user.avatar_url}
        style={{ '--avatar-size': avatarSize }}
      />

      <div className={css.Login}>{user.login}</div>
    </div>
  );
}
