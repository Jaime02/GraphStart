import postResolvers from "@/app/graphql/resolvers/post";
import userResolvers from "@/app/graphql/resolvers/user";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  Subscription: {
    ...userResolvers.Subscription,
    ...postResolvers.Subscription,
  },
  User: userResolvers.User,
  Post: postResolvers.Post,
};
