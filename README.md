# TanStack Start & GraphQL example: "GraphStart"

An example repository showcasing how to integrate GraphQL queries and subscriptions in a TanStack Start application. Data is synchronized in real-time with the backend using GraphQL subscriptions.

## Table of Contents

- [Overview](#overview)
- [Stack](#stack)
- [How It Works](#how-it-works)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Other](#other)
- [Pending tasks](#pending-tasks)
- [Known issues](#known-issues)

## Overview

**GraphStart** demonstrates a minimal setup for:

- Building a backend with **GraphQL** (Apollo Server) that supports queries, mutations, and subscriptions.
- Connecting a frontend built with **TanStack Start** to that backend using **Apollo Client**.
- Using **Drizzle ORM** for type-safe database interactions.
- Styling with **Tailwind CSS** for rapid UI development.
- Achieving real-time data synchronization via GraphQL subscriptions.

This example is perfect if you want to see how to wire up a modern full-stack TypeScript project with real-time features.

## Stack

- **[Drizzle ORM](https://orm.drizzle.team/)**: A lightweight, type-safe ORM for SQL databases.
- **[TanStack Start](https://tanstack.com/start)**: A zero-config, batteries-included starter for React and TypeScript apps.
- **[GraphQL](https://graphql.org/)**: A query language for APIs and a runtime to execute those queries.
  - **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)**: A community-driven, spec-compliant GraphQL server.
  - **[Apollo Client](https://www.apollographql.com/docs/react/)**: A fully-featured caching GraphQL client for React.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.
- **TypeScript**: For static typing on both client and server.

## How It Works

- Drizzle defines the database schema and ORM client
-  Apollo Server handles GraphQL operations and pushes subscription events via WebSocket
- Apollo Client on the frontend handles queries, mutations, and live subscriptions
- TanStack Start wires everything together in a full-stack React app
- Tailwind provides the UI styling layer

## Features

- **GraphQL Queries & Mutations**
  Fetch and update data via GraphQL resolvers.
- **Real-time Subscriptions**
  Automatically update the frontend when data changes on the server.
- **Type-Safe Database Access**
  Use Drizzle ORM to interact with the database without writing raw SQL.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jaime02/GraphStart.git
   cd graphstart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
    ```bash
    npx drizzle-kit push
    ```

4. **Seed the database**
    ```bash
    npm run db:seed
    ```

5. **Run the project**
    ```bash
    npm run dev
    ```

### Other

- Regenerate GraphQL generated code
    ```bash
    npx graphql-codegen --config ./app/graphql/codegen.ts
    ```

## Pending tasks

- Review, refactor, simplify and improve the GraphQL code structure. Specially the [graphql.ts route file](app/routes/api/graphql.ts)
- Add user and post edit feature

## Known issues

- Hot reload causes that the subscription events are executed multiple times. I don't know whether there is a bug in the code or in the libraries
