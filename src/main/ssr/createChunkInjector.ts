/**
 * A transform stream that injects chunks into the React stream when it is idle (not pushing chunks synchronously).
 */
export interface ChunkInjector extends ReadableWritablePair {
  /**
   * Pushes a new chunk to React stream. The chunk may be enqueued synchronously if the stream is idle, or deferred
   * until either stream is idle or flushed.
   *
   * @param chunk The chunk content. Empty strings are ignored.
   */
  pushChunk(chunk: string | null | undefined): void;
}

/**
 * Creates a new transform stream that injects chunks into the React stream when it is idle (not pushing chunks
 * synchronously).
 *
 * Pushed and pulled chunks are guaranteed to be enqueued after a synchronous batch of React chunks is enqueued.
 *
 * @example
 * const stream = await React.renderToReadableStream(...);
 *
 * const chunkInjector = createChunkInjector(() => {
 *   // Pull a chunk here and return it to be enqueued
 * });
 *
 * stream.pipeThrough(chunkInjector);
 *
 * // Push a chunk to enqueue it when the stream is idle
 * chunkInjector.pushChunk('<script>console.log("hello")</script>');
 *
 * @param pullChunk A callback that returns the chunk that must be enqueued.
 */
export function createChunkInjector(pullChunk?: () => string | null | undefined): ChunkInjector {
  const textEncoder = new TextEncoder();

  let isBusy = true;
  let isScheduled = false;
  let pendingChunks: string[] = [];
  let streamController: TransformStreamDefaultController<Uint8Array>;

  const pushPendingChunk = (chunk: string | null | undefined) => {
    if (chunk === '' || chunk === null || chunk === undefined) {
      return;
    }

    pendingChunks.push(chunk);
  };

  const enqueuePendingChunks = () => {
    if (isBusy) {
      // Stream is busy enqueueing React chunks
      return;
    }

    pushPendingChunk(pullChunk?.());

    if (pendingChunks.length === 0) {
      // Nothing to enqueue
      return;
    }

    for (const chunk of pendingChunks) {
      try {
        streamController.enqueue(textEncoder.encode(chunk));
      } catch (error) {
        streamController.error(error);
      }
    }

    pendingChunks = [];
  };

  const flushPendingChunks = () => {
    isBusy = false;
    isScheduled = false;

    enqueuePendingChunks();
  };

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
    start(controller) {
      streamController = controller;
    },

    transform(chunk, controller) {
      enqueuePendingChunks();

      isBusy = true;
      controller.enqueue(chunk);

      if (isScheduled) {
        return;
      }

      isScheduled = true;
      queueMicrotask(flushPendingChunks);
    },

    flush: flushPendingChunks,
  });

  return {
    readable,
    writable,

    pushChunk(chunk) {
      pushPendingChunk(chunk);
      enqueuePendingChunks();
    },
  };
}
