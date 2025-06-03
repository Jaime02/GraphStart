import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "@/app/graphql/queries";

export const Route = createFileRoute("/user/$userId")({
  component: UserDetail,
});

function UserDetail() {
  const { userId } = Route.useParams();

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    errorPolicy: "all",
  });

  if (loading) return <div className="p-4">Loading user...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!data?.user) return <div className="p-4">User not found</div>;

  const user = data.user;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-800">{user.email}</p>
          <p className="text-sm text-gray-800">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">
            Posts ({user.posts?.length || 0})
          </h2>
          {user.posts?.length > 0 ? (
            <div className="space-y-4">
              {user.posts.map((post: any) => (
                <article key={post.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  {post.content && (
                    <p className="text-gray-700 mb-2">{post.content}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Published: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              This user hasn't written any posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
