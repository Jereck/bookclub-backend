import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { bookclub, book } from './db/schema'
import type { auth } from "./utils/auth";

export type Bookclub = InferSelectModel<typeof bookclub>;
export type Book = InferSelectModel<typeof book>;

export type NewBookclub = InferInsertModel<typeof bookclub>;
export type NewBook = InferInsertModel<typeof book>;

export type HonoEnv = {
    Variables: {
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    }
}