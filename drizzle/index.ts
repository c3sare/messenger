import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./relations";

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client, relations });
