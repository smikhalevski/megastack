import {
  Executor,
  ExecutorManager,
  useExecutor,
  useExecutorManager,
  useExecutorSubscription,
  useExecutorSuspense,
} from 'react-executor';
import { notFound } from 'react-corsair';
import { CookieStorage } from 'whoopie';
import { pickLocale } from 'locale-matcher';
import { supportedLocales } from '@mfml/messages/metadata';

const LOCALE_COOKIE = 'locale';
const LOCALE_EXECUTOR_KEY = 'locale';

export function useLocale(): [locale: string, setLocale: (locale: string) => void] {
  const localeExecutor = useExecutor(LOCALE_EXECUTOR_KEY);

  return [localeExecutor.get(), localeExecutor.resolve];
}

export function prepareLocaleExecutor(
  executorManager: ExecutorManager,
  cookieStorage: CookieStorage,
  userLanguages: readonly string[]
): void {
  let locale = cookieStorage.get(LOCALE_COOKIE);

  if (!supportedLocales.includes(locale)) {
    locale = pickLocale(userLanguages, supportedLocales, supportedLocales[0] || 'en');
  }

  executorManager.getOrCreate(LOCALE_EXECUTOR_KEY, locale, [
    executor =>
      executor.subscribe(event => {
        if (event.type === 'fulfilled') {
          cookieStorage.set(LOCALE_COOKIE, event.target.value);
        }
      }),
  ]);
}

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

export function getRepositoryExecutor(executorManager: ExecutorManager, slug: string): Executor<GitHub.Repository> {
  return executorManager.getOrCreate(['repository', slug], signal =>
    fetchJSON(`https://api.github.com/repos/${slug}`, { signal })
  );
}

export function useRepository(slug: string): GitHub.Repository {
  const repositoryExecutor = getRepositoryExecutor(useExecutorManager(), slug);

  // Re-render component when executor state changes, activates an executor on mount
  useExecutorSubscription(repositoryExecutor);

  // Suspend rendering until executor is settled
  useExecutorSuspense(repositoryExecutor);

  return repositoryExecutor.get();
}

export function useStargazers(slug: string): GitHub.User[] {
  const stargazersExecutor = useExecutor(['repository_stargazers', slug], signal =>
    fetchJSON(`https://api.github.com/repos/${slug}/stargazers`, { signal })
  );

  useExecutorSuspense(stargazersExecutor);

  return stargazersExecutor.get();
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
