import { router } from '..';

import { ChatGPTRouter } from './chatGPTRouter';
import { userRouter } from './userRouter';

export const appRouter = router({
  user: userRouter,
  chat: ChatGPTRouter,
});

export type AppRouter = typeof appRouter;
