import 'vite/client';
import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }

  interface DOMAttributes<T> {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}
