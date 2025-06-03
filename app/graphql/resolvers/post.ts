import { POST_CHANGED, pubsub } from "@/app/graphql/queries";
import db from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const postResolvers = {
  Query: {
    posts: async () => {
      return await db.select().from(posts);
    },
    post: async (_: any, { id }: { id: string }) => {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.id, parseInt(id)));
      return result[0];
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      {
        title,
        content,
        authorId,
      }: { title: string; content?: string; authorId: string }
    ) => {
      const result = await db
        .insert(posts)
        .values({
          title,
          content,
          authorId: parseInt(authorId),
          createdAt: new Date(),
        })
        .returning();

      const newPost = result[0];
      pubsub.publish(POST_CHANGED, {
        postChanged: {
          type: "CREATED",
          post: newPost,
        },
      });

      return newPost;
    },
  },
  Subscription: {
    postChanged: {
      subscribe: () => pubsub.asyncIterableIterator([POST_CHANGED]),
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

export default postResolvers;
