import JSONMarshal from 'json-marshal';

export const ssrStateSerializer = JSONMarshal;

const executorKeyOptions: JSONMarshal.SerializationOptions = { isStable: true };

export const executorKeyIdGenerator = (key: string) => JSONMarshal.stringify(key, executorKeyOptions);
