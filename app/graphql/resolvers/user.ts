import { pubsub, USER_CHANGED } from "@/app/graphql/queries";
import db from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ID } from "graphql-ws";

const userResolvers = {
  Query: {
    users: async () => {
      return await db.select().from(users);
    },
    user: async (_: any, { id }: { id: string }) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)));
      return result[0];
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { name, email }: { name: string; email: string }
    ) => {
      const result = await db
        .insert(users)
        .values({
          name,
          email,
          createdAt: new Date(),
        })
        .returning();

      const newUser = result[0];
      pubsub.publish(USER_CHANGED, {
        userChanged: {
          type: "CREATED",
          user: newUser,
        },
      });
      return newUser;
    },
    deleteUser: async (_: any, { userId }: { userId: ID }) => {
      const deleted = (await db.delete(users).where(eq(users.id, Number(userId)))).rowsAffected;
      if (deleted === 0) {
        return null;
      }

      pubsub.publish(USER_CHANGED, {
        userChanged: {
          type: "DELETED",
          userId,
        },
      });
      return userId;
    },
  },
  Subscription: {
    userChanged: {
      subscribe: () => pubsub.asyncIterableIterator([USER_CHANGED]),
    },
  },
  User: {
    posts: async (parent: any) => {
      return await db.select().from(posts).where(eq(posts.authorId, parent.id));
    },
  },
  Post: {
    author: async (parent: any) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, parent.authorId));
      return result[0];
    },
  },
};

export default userResolvers;
