import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import { useState } from "react";
import {
  GET_USERS_WITH_POSTS,
  CREATE_USER,
  CREATE_POST,
  USER_CHANGED_SUBSCRIPTION,
  POST_CHANGED_SUBSCRIPTION,
  DELETE_USER,
} from "@/app/graphql/queries";
import { Post, User } from "@/app/graphql/graphql";

export const Route = createFileRoute("/")({
  component: GraphQLUsers,
});

function GraphQLUsers() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  // GraphQL queries and mutations using Apollo hooks
  const { data, loading, error, refetch } = useQuery(GET_USERS_WITH_POSTS, {
    errorPolicy: "all",
  });

  const [createUser, { loading: createUserLoading }] = useMutation(
    CREATE_USER,
    {
      onCompleted: () => {
        setUserName("");
        setUserEmail("");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
      },
    }
  );

  const [createPost, { loading: createPostLoading }] = useMutation(
    CREATE_POST,
    {
      update(cache, { data: { createPost } }) {
        cache.modify({
          fields: {
            posts(existingPostRefs = [], { readField }) {
              const filtered = existingPostRefs.filter(
                (ref) => readField("id", ref) !== createPost.id
              );

              const newPostRef = cache.writeFragment({
                data: createPost,
                fragment: gql`
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
                `,
              });

              return [newPostRef, ...filtered];
            },
          },
        });
      },
      onCompleted: () => {
        setPostTitle("");
        setPostContent("");
        setSelectedAuthor("");
      },
      onError: (error) => {
        console.error("Error creating post:", error);
      },
    }
  );

  const [deleteUser, { loading: deleteUserLoading }] = useMutation(
    DELETE_USER,
    {
      update(cache, { data: { deleteUserId } }) {
        cache.modify({
          fields: {
            users(existingUserRefs = [], { readField }) {
              return existingUserRefs.filter(
                (userRef: any) => readField("id", userRef) !== deleteUserId
              );
            },
          },
        });
      },
      onCompleted: (data) => {
        if (data.deleteUser === null) {
          alert("User not found or already deleted.");
          refetch();
        }
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
      },
    }
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      createUser({
        variables: { name: userName, email: userEmail },
      });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postTitle && selectedAuthor) {
      createPost({
        variables: {
          title: postTitle,
          content: postContent || null,
          authorId: selectedAuthor,
        },
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user and their posts?"
      )
    ) {
      deleteUser({ variables: { userId } });
    }
  };

  useSubscription(USER_CHANGED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (!data.data || !data.data.userChanged) {
        console.warn("User subscription data is incomplete:", data);
        return;
      }

      const { type, user, userId } = data.data.userChanged;
      console.log(`User ${type}:`, user ? user : userId);

      const existingUsersQuery = client.readQuery({
        query: GET_USERS_WITH_POSTS,
      });

      if (!existingUsersQuery) {
        console.warn("GET_USERS_WITH_POSTS query not found in cache.");
        return;
      }

      let updatedUsers = [...existingUsersQuery.users];

      if (type === "CREATED") {
        updatedUsers = [...updatedUsers, user];
      } else if (type === "UPDATED") {
        updatedUsers = updatedUsers.map((u) => (u.id === user.id ? user : u));
      } else if (type === "DELETED") {
        updatedUsers = updatedUsers.filter((u) => u.id !== userId);
      } else {
        console.warn(`Unknown user change type: ${type}`);
      }

      client.writeQuery({
        query: GET_USERS_WITH_POSTS,
        data: { users: updatedUsers },
      });
    },
    onError: (err) => console.error("User subscription error:", err),
  });

  useSubscription(POST_CHANGED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (!data.data || !data.data.postChanged) {
        console.warn("Post subscription data is incomplete:", data);
        return;
      }

      const { type, post } = data.data.postChanged;
      console.log(`Post ${type}:`, post);

      const existingUsersQuery = client.readQuery({
        query: GET_USERS_WITH_POSTS,
      });

      if (!existingUsersQuery) {
        console.warn(
          "GET_USERS_WITH_POSTS query not found in cache for post update."
        );
        return;
      }

      let updatedUsers = existingUsersQuery.users.map((user: User) => {
        if (user.id === post.author.id) {
          let updatedPosts = [...(user.posts || [])];

          if (type === "CREATED") {
            updatedPosts = [...updatedPosts, post];
          } else if (type === "UPDATED") {
            updatedPosts = updatedPosts.map((p) =>
              p.id === post.id ? post : p
            );
          } else if (type === "DELETED") {
            updatedPosts = updatedPosts.filter((p) => p.id !== post.id);
          } else {
            console.warn(`Unknown post change type: ${type}`);
          }
          return { ...user, posts: updatedPosts };
        }
        return user;
      });

      client.writeQuery({
        query: GET_USERS_WITH_POSTS,
        data: { users: updatedUsers },
      });
    },
    onError: (err) => console.error("Post subscription error:", err),
  });

  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        GraphQL queries & subscriptions
      </h1>
      {loading ? (
        <div className="p-4">Loading users...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Create User Form */}
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Create User</h2>
              <form onSubmit={handleCreateUser} className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={createUserLoading}
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createUserLoading ? "Creating User..." : "Create User"}
                </button>
              </form>
            </div>
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Create Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-2">
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Select Author</option>
                  {data?.users?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  required
                />
                <textarea
                  placeholder="Post Content (optional)"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full border p-2 rounded-lg h-24 resize-none"
                />
                <button
                  type="submit"
                  disabled={
                    createPostLoading || loading || !data?.users?.length
                  }
                  className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPostLoading ? "Creating Post..." : "Create Post"}
                </button>
              </form>
            </div>
          </div>
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Users and Their Posts
            </h2>
            {data?.users?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found. Create your first user above!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.users?.map((user: User) => (
                  <div
                    key={user.id}
                    className="bg-white border rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex">
                      <a
                        className="mb-2 flex flex-col gap-1 grow text-blue-500 underline"
                        href={`/user/${user.id}`}
                      >
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                      </a>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserLoading}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {deleteUserLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="">Posts ({user.posts?.length || 0})</h4>
                      {user.posts?.length > 0 ? (
                        user.posts.map((post: Post) => (
                          <div
                            key={post.id}
                            className="bg-gray-50 p-2 rounded-lg"
                          >
                            <h5 className="font-medium text-sm text-gray-900 mb-1">
                              {post.title}
                            </h5>
                            {post.content && (
                              <p className="text-xs text-gray-700 mb-1">
                                {post.content.length > 80
                                  ? `${post.content.substring(0, 80)}...`
                                  : post.content}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 italic">
                          No posts yet
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
