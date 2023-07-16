import { prisma } from 'db/prisma-client';
import { z } from 'zod';

import { router, publicProcedure } from '../';

export const userRouter = router({
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),

  show: publicProcedure.input(z.string().min(1)).query(async ({ input: userId }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  }),

  destroy: publicProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input: { id } }) => {
    const result = await prisma.user.delete({
      where: { id },
    });

    return result;
  }),

  create: publicProcedure
    .input(z.object({ email: z.string().email(), name: z.string().min(1) }))
    .mutation(async ({ input: { email, name } }) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      return newUser;
    }),
});
