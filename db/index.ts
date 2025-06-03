import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle(process.env.DATABASE_URL || "file:./dev.db");

export default db;