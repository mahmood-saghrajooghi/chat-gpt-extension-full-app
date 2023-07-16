import { IncomingMessage } from 'http';

import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import ws from 'ws';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws> | trpcNext.CreateNextContextOptions,
) => {
  console.log('createContext', opts);
  return {};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
