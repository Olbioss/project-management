import type { AnyD1Database, DrizzleD1Database } from 'drizzle-orm/d1';
import type { Context, Next } from 'hono';
import { getDb } from './db';
import * as schema from './db/schema';

export type Bindings = {
    DB: AnyD1Database;
    ENVIRONMENT?: string;
};

export type AppContext = {
    Bindings: Bindings;
    Variables: { drizzle: DrizzleD1Database<typeof schema> };
};

export default function withDrizzle(c: Context<AppContext>, next: Next) {
    if (!c.get('drizzle')) {
        const db = getDb(c.env.DB);
        c.set('drizzle', db)
    }
    return next();
}