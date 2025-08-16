export interface ChunkInjector extends ReadableWritablePair {
  pushChunk(chunk: string): void;
}

export function createChunkInjector(pullChunk?: () => string): ChunkInjector {
  const textEncoder = new TextEncoder();

  let canInject = false;
  let hasPostTransform = false;
  let chunkBuffer: string[] = [];
  let lastController: TransformStreamDefaultController<Uint8Array>;

  const inject = (): void => {
    if (!canInject) {
      return;
    }

    const chunk = chunkBuffer.join('') + (pullChunk !== undefined ? pullChunk() : '');

    if (chunk !== '') {
      chunkBuffer = [];
      lastController.enqueue(textEncoder.encode(chunk));
    }
  };

  const postTransform = (): void => {
    hasPostTransform = false;
    canInject = true;
    inject();
  };

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      lastController = controller;

      inject();

      canInject = false;
      controller.enqueue(chunk);

      if (!hasPostTransform) {
        hasPostTransform = true;
        queueMicrotask(postTransform);
      }
    },
  });

  return {
    readable,
    writable,

    pushChunk(chunk) {
      if (chunk !== '') {
        chunkBuffer.push(chunk);
        inject();
      }
    },
  };
}
