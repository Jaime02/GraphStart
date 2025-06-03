import postResolvers from "@/app/graphql/resolvers/post";
import userResolvers from "@/app/graphql/resolvers/user";
import { mergeResolvers } from '@graphql-tools/merge';

const resolvers = mergeResolvers([postResolvers, userResolvers]);
export default resolvers;