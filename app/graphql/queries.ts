import { gql } from "@apollo/client";
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const USER_CHANGED = 'USER_CHANGED';
export const POST_CHANGED = 'POST_CHANGED';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      createdAt
    }
  }
`;

export const GET_USERS_WITH_POSTS = gql`
  query GetUsersWithPosts {
    users {
      id
      name
      posts {
        id
        title
        content
        createdAt
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      posts {
        id
        title
        content
        createdAt
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const USER_CHANGED_SUBSCRIPTION = gql`
  subscription UserChangedSubscription {
    userChanged {
      type
      userId
      user {
        id
        name
        email
        createdAt
        posts {
          id
          title
          content
          createdAt
        }
      }
    }
  }
`;

export const POST_CHANGED_SUBSCRIPTION = gql`
  subscription PostChangedSubscription {
    postChanged {
      type
      post {
        id
        title
        content
        createdAt
        author {
          id
          name
          email
        }
      }
    }
  }
`;