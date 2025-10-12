import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { bookclubs, books } from './db/schema'
import type { auth } from "./utils/auth";

export type Bookclub = InferSelectModel<typeof bookclubs>;
export type Book = InferSelectModel<typeof books>;

export type NewBookclub = InferInsertModel<typeof bookclubs>;
export type NewBook = InferInsertModel<typeof books>;

export type HonoEnv = {
    Variables: {
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    }
}