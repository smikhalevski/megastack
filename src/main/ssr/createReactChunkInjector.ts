export interface ReactChunkInjector extends ReadableWritablePair {
  inject(chunk: string): void;
}

export function createReactChunkInjector(nextChunk?: () => string): ReactChunkInjector {
  const textEncoder = new TextEncoder();

  let canInject = false;
  let hasPostTransform = false;
  let chunkBuffer: string[] = [];
  let lastController: TransformStreamDefaultController<Uint8Array>;

  const inject = (): void => {
    if (!canInject) {
      return;
    }

    const chunk = chunkBuffer.join('') + (nextChunk !== undefined ? nextChunk() : '');

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

    inject(chunk) {
      if (chunk !== '') {
        chunkBuffer.push(chunk);
        inject();
      }
    },
  };
}
