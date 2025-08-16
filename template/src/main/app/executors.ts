import { useExecutor, useExecutorSuspense } from 'react-executor';
import { notFound } from 'react-corsair';

export namespace GitHub {
  export interface Repository {
    id: number;
    name: string;
    description: string;
    language: string;
    full_name: string;
    stargazers_count: number;
    owner: User;
    topics: string[];
  }

  export interface User {
    id: number;
    login: string;
    avatar_url: string;
  }
}

export function useRepositories(): GitHub.Repository[] {
  const repositoriesExecutor = useExecutor('repositories', async signal => {
    const { items } = await fetchJSON(
      'https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10',
      { signal }
    );

    return items;
  });

  return useExecutorSuspense(repositoriesExecutor).get();
}

export function useRepository(slug: string): GitHub.Repository {
  slug = slug.replace(/\/$/, '');

  const repositoryExecutor = useExecutor(['repository', slug], signal =>
    fetchJSON(`https://api.github.com/repos/${slug}`, { signal })
  );

  return useExecutorSuspense(repositoryExecutor).get();
}

export function useStargazers(slug: string): GitHub.User[] {
  slug = slug.replace(/\/$/, '');

  const stargazersExecutor = useExecutor(['repository_stargazers', slug], signal =>
    fetchJSON(`https://api.github.com/repos/${slug}/stargazers`, { signal })
  );

  return useExecutorSuspense(stargazersExecutor).get();
}

async function fetchJSON(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, options);

  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    notFound();
  }

  throw new Error(`Failed to fetch ${url}: HTTP ${response.status} ${response.statusText}`);
}
