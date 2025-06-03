import db from "@/db";
import { users, posts } from "@/db/schema";

async function seed() {
  console.log("Starting database seed");

  try {
    console.log("Clearing existing data");
    await db.delete(posts);
    await db.delete(users);

    console.log("Seeding users...");
    const seedUsers = await db
      .insert(users)
      .values([
        {
          name: "John Doe",
          email: "john@example.com",
          createdAt: new Date("2024-01-15T10:00:00Z"),
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: new Date("2024-01-16T14:30:00Z"),
        },
        {
          name: "Alice Johnson",
          email: "alice@example.com",
          createdAt: new Date("2024-01-17T09:15:00Z"),
        },
        {
          name: "Bob Wilson",
          email: "bob@example.com",
          createdAt: new Date("2024-01-18T16:45:00Z"),
        },
        {
          name: "Charlie Brown",
          email: "charlie@example.com",
          createdAt: new Date("2024-01-19T11:20:00Z"),
        },
      ])
      .returning();

    console.log(`Created ${seedUsers.length} users`);

    console.log("Seeding posts...");
    const seedPosts = await db
      .insert(posts)
      .values([
        {
          title: "Getting Started with TanStack Start",
          content:
            "TanStack Start is a full-stack React framework that provides a great developer experience...",
          authorId: seedUsers[0].id,
          createdAt: new Date("2024-01-20T10:00:00Z"),
        },
        {
          title: "Introduction to Drizzle ORM",
          content:
            "Drizzle ORM is a lightweight and performant TypeScript ORM that works great with SQLite...",
          authorId: seedUsers[0].id,
          createdAt: new Date("2024-01-21T15:30:00Z"),
        },
        {
          title: "Building Modern Web Applications",
          content:
            "Modern web development has evolved significantly. Here are some best practices...",
          authorId: seedUsers[1].id,
          createdAt: new Date("2024-01-22T09:45:00Z"),
        },
        {
          title: "GraphQL with Apollo Server",
          content:
            "Setting up GraphQL with Apollo Server provides a powerful API layer for your applications...",
          authorId: seedUsers[1].id,
          createdAt: new Date("2024-01-23T14:20:00Z"),
        },
        {
          title: "Database Design Patterns",
          content:
            "Understanding database design patterns is crucial for building scalable applications...",
          authorId: seedUsers[2].id,
          createdAt: new Date("2024-01-24T11:10:00Z"),
        },
        {
          title: "TypeScript Best Practices",
          content:
            "TypeScript provides excellent type safety. Here are some patterns to follow...",
          authorId: seedUsers[2].id,
          createdAt: new Date("2024-01-25T16:00:00Z"),
        },
        {
          title: "React Performance Optimization",
          content:
            "Optimizing React applications involves several techniques including memoization...",
          authorId: seedUsers[3].id,
          createdAt: new Date("2024-01-26T13:35:00Z"),
        },
        {
          title: "Full-Stack Development with TanStack",
          content:
            "The TanStack ecosystem provides everything you need for modern full-stack development...",
          authorId: seedUsers[4].id,
          createdAt: new Date("2024-01-27T10:50:00Z"),
        },
      ])
      .returning();

    console.log(`Created ${seedPosts.length} posts`);

    console.log("🎉 Database seeding completed successfully! 🎉");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
