import { expect, test, vi } from 'vitest';
import React, { lazy, Suspense } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';
import { createChunkInjector } from '../main/ssr/createChunkInjector.js';

async function readText(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();

  let text = '';

  for (let result; !(result = await reader.read()).done; ) {
    text += decoder.decode(result.value, { stream: true });
  }

  return text + decoder.decode();
}

test('enqueues pushed chunk before the suspense boundary', async () => {
  const MyComponent = lazy(
    () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, { default: () => <div>{'AAA'}</div> });
      })
  );

  const stream = await renderToReadableStream(
    <html>
      <body>
        <Suspense fallback={'Loading'}>
          <MyComponent />
        </Suspense>
      </body>
    </html>
  );

  const chunkInjector = createChunkInjector();

  chunkInjector.pushChunk('BBB');

  expect(await readText(stream.pipeThrough(chunkInjector).getReader())).toBe(
    '<!DOCTYPE html>' +
      '<html>' +
      '<head></head>' +
      '<body>' +
      '<!--$?-->' +
      '<template id="B:0"></template>' +
      'Loading' +
      '<!--/$-->' +
      'BBB' +
      '<div hidden id="S:0"><div>AAA</div></div>' +
      '<script>$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("B:0","S:0")</script>' +
      '</body>' +
      '</html>'
  );
});

test('enqueues pulled chunk before the suspense boundary', async () => {
  const MyComponent = lazy(
    () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, { default: () => <div>{'AAA'}</div> });
      })
  );

  const stream = await renderToReadableStream(
    <html>
      <body>
        <Suspense fallback={'Loading'}>
          <MyComponent />
        </Suspense>
      </body>
    </html>
  );

  const pullChunkMock = vi.fn().mockReturnValueOnce('BBB');

  const chunkInjector = createChunkInjector(pullChunkMock);

  expect(await readText(stream.pipeThrough(chunkInjector).getReader())).toBe(
    '<!DOCTYPE html>' +
      '<html>' +
      '<head></head>' +
      '<body>' +
      '<!--$?-->' +
      '<template id="B:0"></template>' +
      'Loading' +
      '<!--/$-->' +
      'BBB' +
      '<div hidden id="S:0"><div>AAA</div></div>' +
      '<script>$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("B:0","S:0")</script>' +
      '</body>' +
      '</html>'
  );

  expect(pullChunkMock).toHaveBeenCalledTimes(6);
});
