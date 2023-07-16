import { EventEmitter } from 'events';

import { observable } from '@trpc/server/observable';
import { prisma } from 'db/prisma-client';
import { z } from 'zod';

import { router, publicProcedure } from '..';

const ee = new EventEmitter();

export const ChatGPTRouter = router({
  listConversations: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input: { userId } }) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      const conversations = await prisma.conversation.findMany({
        where: {
          userId: user.id,
        },
      });

      return conversations;
    }),

  createOrUpdateConversation: publicProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
        userId: z.string().min(1),
        title: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ input: { conversationId, userId, title } }) => {
      const conversation = await prisma.conversation.upsert({
        where: { chatGTPConversationId: conversationId },
        create: {
          chatGTPConversationId: conversationId,
          // title,
          userId,
        },
        update: {
          // title,
          userId,
        },
      });
      return conversation;
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

  createConversation: publicProcedure
    .input(z.object({ title: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ input: { title, email } }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      const result = await prisma.conversation.create({
        data: {
          title,
          userId: user.id,
        },
      });

      return result;
    }),

  onSendMessage: publicProcedure.subscription(() => {
    return observable((emit) => {
      const onConversation = (data: { content: string }) => {
        // emit data to client
        emit.next(data);
      };
      ee.on('sendMessage', onConversation);
      return () => {
        ee.off('sendMessage', onConversation);
      };
    });
  }),

  sendMessage: publicProcedure
    .input(z.object({ content: z.string(), conversationId: z.string() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input: { content, conversationId } }) => {
      const result = await prisma.message.create({
        data: {
          content,
          conversationId,
        },
      });

      return result;
    }),

  onMessageResponse: publicProcedure.subscription(() => {
    return observable((emit) => {
      const onConversation = (data: { messageId: string; response: string }) => {
        // emit data to client
        emit.next(data);
      };
      ee.on('messageResponse', onConversation);
      return () => {
        ee.off('messageResponse', onConversation);
      };
    });
  }),

  messageResponse: publicProcedure
    .input(z.object({ response: z.string().min(1), messageId: z.string().min(1) }))
    .mutation(async ({ input: { response, messageId } }) => {
      console.log('we are here 🔥');
      const result = await prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          response,
        },
      });

      ee.emit('sendMessage', result);

      return result;
    }),

  updateMessageConversationId: publicProcedure
    .input(z.object({ id: z.string().min(1), conversationId: z.string().min(1) }))
    .mutation(async ({ input: { id, conversationId } }) => {
      const result = await prisma.message.update({
        where: {
          id,
        },
        data: {
          conversationId,
        },
      });

      return result;
    }),
});
