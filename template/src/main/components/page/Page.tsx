import React, { ReactNode } from 'react';

export interface PageProps {
  children: ReactNode;
}

export function Page(props: PageProps): ReactNode {
  return <>{props.children}</>;
}
