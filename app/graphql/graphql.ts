/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ChangeType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED'
}

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createUser: User;
  deleteUser?: Maybe<Scalars['ID']['output']>;
};


export type MutationCreatePostArgs = {
  authorId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type PostChangePayload = {
  __typename?: 'PostChangePayload';
  post: Post;
  type: ChangeType;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
  posts: Array<Post>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  postChanged: PostChangePayload;
  userChanged: UserChangePayload;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
};

export type UserChangePayload = {
  __typename?: 'UserChangePayload';
  type: ChangeType;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type NewPostFragment = { __typename?: 'Post', id: string, title: string, content?: string | null, createdAt: number, author: { __typename?: 'User', id: string, name: string } } & { ' $fragmentName'?: 'NewPostFragment' };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const NewPostFragmentDoc = new TypedDocumentString(`
    fragment NewPost on Post {
  id
  title
  content
  createdAt
  author {
    id
    name
  }
}
    `, {"fragmentName":"NewPost"}) as unknown as TypedDocumentString<NewPostFragment, unknown>;